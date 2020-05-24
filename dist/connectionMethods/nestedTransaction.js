"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _serializeError = require("serialize-error");

var _binders = require("../binders");

var _utilities = require("../utilities");

const nestedTransaction = async (parentLog, connection, clientConfiguration, handler, transactionDepth) => {
  const newTransactionDepth = transactionDepth + 1;

  if (connection.connection.slonik.mock === false) {
    await connection.query('SAVEPOINT slonik_savepoint_' + newTransactionDepth);
  }

  const log = parentLog.child({
    transactionId: (0, _utilities.createUlid)()
  });

  try {
    connection.connection.slonik.transactionDepth = newTransactionDepth;
    const result = await handler((0, _binders.bindTransactionConnection)(log, connection, clientConfiguration, newTransactionDepth));
    return result;
  } catch (error) {
    if (connection.connection.slonik.mock === false) {
      await connection.query('ROLLBACK TO SAVEPOINT slonik_savepoint_' + newTransactionDepth);
    }

    log.error({
      error: (0, _serializeError.serializeError)(error)
    }, 'rolling back transaction due to an error');
    throw error;
  } finally {
    connection.connection.slonik.transactionDepth = newTransactionDepth - 1;
  }
};

var _default = nestedTransaction;
exports.default = _default;
//# sourceMappingURL=nestedTransaction.js.map