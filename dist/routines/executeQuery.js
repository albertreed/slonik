"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _getStackTrace = require("get-stack-trace");

var _serializeError = require("serialize-error");

var _utilities = require("../utilities");

var _errors = require("../errors");

// @see https://www.postgresql.org/docs/current/errcodes-appendix.html
const TRANSACTION_ROLLBACK_ERROR_PREFIX = "40";

const retryTransaction = async (connectionLogger, connection, transactionQueries, retryLimit) => {
  let result;
  let remainingRetries = retryLimit;
  let attempt = 0; // @todo Provide information about the queries being retried to the logger.

  while (remainingRetries-- > 0) {
    attempt++;

    try {
      // @todo Respect SAVEPOINTs.
      await connection.query("ROLLBACK");
      await connection.query("BEGIN");

      for (const transactionQuery of transactionQueries) {
        connectionLogger.trace({
          attempt,
          queryId: transactionQuery.executionContext.queryId
        }, "retrying query");
        result = await transactionQuery.executionRoutine(connection, transactionQuery.sql, (0, _utilities.normaliseQueryValues)(transactionQuery.values, connection.native), // @todo Refresh execution context to reflect that the query has been re-tried.
        // This (probably) requires changing `queryId` and `queryInputTime`.
        // It should be needed only for the last query (because other queries will not be processed by the middlewares).
        transactionQuery.executionContext, {
          sql: transactionQuery.sql,
          values: transactionQuery.values
        });
      }
    } catch (error) {
      if (typeof error.code === "string" && error.code.startsWith(TRANSACTION_ROLLBACK_ERROR_PREFIX)) {
        continue;
      }

      throw error;
    }
  }

  return result;
}; // eslint-disable-next-line complexity


const executeQuery = async (connectionLogger, connection, clientConfiguration, rawSql, values, inheritedQueryId, executionRoutine) => {
  if (connection.connection.slonik.terminated) {
    throw new _errors.BackendTerminatedError(connection.connection.slonik.terminated);
  }

  if (rawSql.trim() === "") {
    throw new _errors.InvalidInputError("Unexpected SQL input. Query cannot be empty.");
  }

  if (rawSql.trim() === "$1") {
    throw new _errors.InvalidInputError("Unexpected SQL input. Query cannot be empty. Found only value binding.");
  }

  const queryInputTime = process.hrtime.bigint();
  let stackTrace = null;

  if (clientConfiguration.captureStackTrace) {
    const callSites = new Error().stack.split(/\r?\n/);
    let _result = [];

    for (let _key = 0, _length = callSites.length, _value; _key < _length; ++_key) {
      _value = callSites[_key];
      _result[_key] = {
        columnNumber: 0,
        fileName: _value,
        lineNumber: 0
      };
    }

    stackTrace = _result;
  }

  const queryId = inheritedQueryId || (0, _utilities.createQueryId)();
  const log = connectionLogger.child({
    queryId
  });
  const originalQuery = {
    sql: rawSql,
    values
  };
  let actualQuery = { ...originalQuery
  };
  const executionContext = {
    connectionId: connection.connection.slonik.connectionId,
    log,
    originalQuery,
    poolId: connection.connection.slonik.poolId,
    queryId,
    queryInputTime,
    sandbox: {},
    stackTrace,
    transactionId: connection.connection.slonik.transactionId
  };

  for (const interceptor of clientConfiguration.interceptors) {
    if (interceptor.beforeTransformQuery) {
      interceptor.beforeTransformQuery(executionContext, actualQuery);
    }
  }

  for (const interceptor of clientConfiguration.interceptors) {
    if (interceptor.transformQuery) {
      actualQuery = interceptor.transformQuery(executionContext, actualQuery);
    }
  }

  let result;

  for (const interceptor of clientConfiguration.interceptors) {
    if (interceptor.beforeQueryExecution) {
      result = await interceptor.beforeQueryExecution(executionContext, actualQuery);

      if (result) {
        log.info("beforeQueryExecution interceptor produced a result; short-circuiting query execution using beforeQueryExecution result");
        return result;
      }
    }
  }

  const notices = [];

  const noticeListener = notice => {
    notices.push(notice);
  };

  connection.on("notice", noticeListener);

  try {
    try {
      try {
        if (connection.connection.slonik.transactionQueries) {
          connection.connection.slonik.transactionQueries.push({
            executionContext,
            executionRoutine,
            sql: actualQuery.sql,
            values: actualQuery.values
          });
        }

        result = await executionRoutine(connection, actualQuery.sql, (0, _utilities.normaliseQueryValues)(actualQuery.values, connection.native), executionContext, actualQuery);
      } catch (error) {
        if (typeof error.code === "string" && error.code.startsWith(TRANSACTION_ROLLBACK_ERROR_PREFIX) && clientConfiguration.transactionRetryLimit > 0) {
          result = await retryTransaction(connectionLogger, connection, connection.connection.slonik.transactionQueries, clientConfiguration.transactionRetryLimit);
        } else {
          throw error;
        }
      }
    } catch (error) {
      log.error({
        error: (0, _serializeError.serializeError)(error)
      }, "execution routine produced an error"); // 'Connection terminated' refers to node-postgres error.
      // @see https://github.com/brianc/node-postgres/blob/eb076db5d47a29c19d3212feac26cd7b6d257a95/lib/client.js#L199

      if (error.code === "57P01" || error.message === "Connection terminated") {
        connection.connection.slonik.terminated = error;
        throw new _errors.BackendTerminatedError(error);
      }

      if (error.code === "57014" && error.message.includes("canceling statement due to statement timeout")) {
        throw new _errors.StatementTimeoutError(error);
      }

      if (error.code === "57014") {
        throw new _errors.StatementCancelledError(error);
      }

      if (error.code === "23502") {
        throw new _errors.NotNullIntegrityConstraintViolationError(error, error.constraint);
      }

      if (error.code === "23503") {
        throw new _errors.ForeignKeyIntegrityConstraintViolationError(error, error.constraint);
      }

      if (error.code === "23505") {
        throw new _errors.UniqueIntegrityConstraintViolationError(error, error.constraint);
      }

      if (error.code === "23514") {
        throw new _errors.CheckIntegrityConstraintViolationError(error, error.constraint);
      }

      throw error;
    } finally {
      connection.off("notice", noticeListener);
    }
  } catch (error) {
    for (const interceptor of clientConfiguration.interceptors) {
      if (interceptor.queryExecutionError) {
        await interceptor.queryExecutionError(executionContext, actualQuery, error);
      }
    }

    throw error;
  }

  if (!result) {
    throw new _errors.UnexpectedStateError();
  } // $FlowFixMe


  result.notices = notices;

  for (const interceptor of clientConfiguration.interceptors) {
    if (interceptor.afterQueryExecution) {
      await interceptor.afterQueryExecution(executionContext, actualQuery, result);
    }
  } // Stream does not have `rows` in the result object and all rows are already transformed.


  if (result.rows) {
    for (const interceptor of clientConfiguration.interceptors) {
      if (interceptor.transformRow) {
        const transformRow = interceptor.transformRow;
        const fields = result.fields; // eslint-disable-next-line no-loop-func

        const _iterable2 = result.rows;
        let _result2 = [];

        for (let _key2 = 0, _length2 = _iterable2.length, _value2; _key2 < _length2; ++_key2) {
          _value2 = _iterable2[_key2];
          _result2[_key2] = transformRow(executionContext, actualQuery, _value2, fields);
        }

        const rows = _result2;
        result = { ...result,
          rows
        };
      }
    }
  }

  for (const interceptor of clientConfiguration.interceptors) {
    if (interceptor.beforeQueryResult) {
      await interceptor.beforeQueryResult(executionContext, actualQuery, result);
    }
  }

  return result;
};

var _default = executeQuery;
exports.default = _default;
//# sourceMappingURL=executeQuery.js.map