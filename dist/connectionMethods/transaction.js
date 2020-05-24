"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _serializeError = require("serialize-error");

var _binders = require("../binders");

var _utilities = require("../utilities");

var _errors = require("../errors");

const transaction = async (parentLog, connection, clientConfiguration, handler) => {
  if (connection.connection.slonik.transactionDepth !== null) {
    throw new _errors.UnexpectedStateError('Cannot use the same connection to start a new transaction before completing the last transaction.');
  }

  connection.connection.slonik.transactionDepth = 0;
  connection.connection.slonik.transactionId = (0, _utilities.createUlid)();
  connection.connection.slonik.transactionQueries = [];

  if (connection.connection.slonik.mock === false) {
    await connection.query('START TRANSACTION');
  }

  const log = parentLog.child({
    transactionId: connection.connection.slonik.transactionId
  });

  try {
    const result = await handler((0, _binders.bindTransactionConnection)(log, connection, clientConfiguration, connection.connection.slonik.transactionDepth));

    if (connection.connection.slonik.terminated) {
      throw new _errors.BackendTerminatedError(connection.connection.slonik.terminated);
    }

    if (connection.connection.slonik.mock === false) {
      await connection.query('COMMIT');
    }

    return result;
  } catch (error) {
    if (!connection.connection.slonik.terminated) {
      if (connection.connection.slonik.mock === false) {
        await connection.query('ROLLBACK');
      }

      log.error({
        error: (0, _serializeError.serializeError)(error)
      }, 'rolling back transaction due to an error');
    }

    throw error;
  } finally {
    connection.connection.slonik.transactionDepth = null;
    connection.connection.slonik.transactionId = null;
    connection.connection.slonik.transactionQueries = null;
  }
};

var _default = transaction;
exports.default = _default;
//# sourceMappingURL=transaction.js.map