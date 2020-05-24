"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _serializeError = require("serialize-error");

var _utilities = require("../utilities");

var _Logger = _interopRequireDefault(require("../Logger"));

var _bindPool = _interopRequireDefault(require("../binders/bindPool"));

var _createClientConfiguration = _interopRequireDefault(require("./createClientConfiguration"));

var _createPoolConfiguration = _interopRequireDefault(require("./createPoolConfiguration"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param connectionUri PostgreSQL [Connection URI](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING).
 */
const createPool = (connectionUri, clientConfigurationInput) => {
  const clientConfiguration = (0, _createClientConfiguration.default)(clientConfigurationInput);
  const poolId = (0, _utilities.createUlid)();

  const poolLog = _Logger.default.child({
    poolId
  });

  const poolConfiguration = (0, _createPoolConfiguration.default)(connectionUri, clientConfiguration);
  let pgNativeBindingsAreAvailable = false;

  try {
    /* eslint-disable global-require, import/no-unassigned-import, import/no-extraneous-dependencies */
    // $FlowFixMe
    require('pg-native');
    /* eslint-enable */


    pgNativeBindingsAreAvailable = true;
    poolLog.debug('found pg-native module');
  } catch (error) {
    poolLog.debug('pg-native module is not found');
  }

  let pg;
  let native = false;

  if (clientConfiguration.preferNativeBindings && pgNativeBindingsAreAvailable) {
    poolLog.info('using native libpq bindings'); // eslint-disable-next-line global-require

    pg = require('pg').native;
    native = true;
  } else if (clientConfiguration.preferNativeBindings && !pgNativeBindingsAreAvailable) {
    poolLog.info('using JavaScript bindings; pg-native not found'); // eslint-disable-next-line global-require

    pg = require('pg');
  } else {
    poolLog.info('using JavaScript bindings'); // eslint-disable-next-line global-require

    pg = require('pg');
  }

  const pool = new pg.Pool(poolConfiguration);
  pool.slonik = {
    ended: false,
    mock: false,
    native,
    poolId,
    typeOverrides: null
  }; // istanbul ignore next

  pool.on('error', error => {
    if (!error.client.connection.slonik.terminated) {
      poolLog.error({
        error: (0, _serializeError.serializeError)(error)
      }, 'client connection error');
    }
  }); // istanbul ignore next

  pool.on('connect', client => {
    client.connection = client.connection || {};
    client.connection.slonik = {
      connectionId: (0, _utilities.createUlid)(),
      mock: false,
      native,
      terminated: null,
      transactionDepth: null
    };
    client.on('error', error => {
      if (error.message.includes('Connection terminated unexpectedly') || error.message.includes('server closed the connection unexpectedly')) {
        client.connection.slonik.terminated = error;
      }

      poolLog.error({
        error: (0, _serializeError.serializeError)(error)
      }, 'client error');
    });
    client.on('notice', notice => {
      poolLog.info({
        notice: {
          level: notice.name,
          message: notice.message
        }
      }, 'notice message');
    });
    poolLog.debug({
      processId: client.processID,
      stats: {
        idleConnectionCount: pool.idleCount,
        totalConnectionCount: pool.totalCount,
        waitingRequestCount: pool.waitingCount
      }
    }, 'created a new client connection');
  }); // istanbul ignore next

  pool.on('acquire', client => {
    poolLog.debug({
      processId: client.processID,
      stats: {
        idleConnectionCount: pool.idleCount,
        totalConnectionCount: pool.totalCount,
        waitingRequestCount: pool.waitingCount
      }
    }, 'client is checked out from the pool');
  }); // istanbul ignore next

  pool.on('remove', client => {
    poolLog.debug({
      processId: client.processID,
      stats: {
        idleConnectionCount: pool.idleCount,
        totalConnectionCount: pool.totalCount,
        waitingRequestCount: pool.waitingCount
      }
    }, 'client connection is closed and removed from the client pool');
  });
  return (0, _bindPool.default)(poolLog, pool, clientConfiguration);
};

var _default = createPool;
exports.default = _default;
//# sourceMappingURL=createPool.js.map