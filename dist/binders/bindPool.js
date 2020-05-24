"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _factories = require("../factories");

var _connectionMethods = require("../connectionMethods");

var _assertions = require("../assertions");

const bindPool = (parentLog, pool, clientConfiguration) => {
  // eslint-disable-next-line flowtype/no-weak-types
  const mapConnection = targetMethodName => {
    return query => {
      if (typeof query === 'string') {
        throw new TypeError('Query must be constructed using `sql` tagged template literal.');
      }

      return (0, _factories.createConnection)(parentLog, pool, clientConfiguration, 'IMPLICIT_QUERY', (connectionLog, connection, boundConnection) => {
        return boundConnection[targetMethodName](query);
      }, newPool => {
        return newPool[targetMethodName](query);
      }, query);
    };
  };

  return {
    any: mapConnection('any'),
    anyFirst: mapConnection('anyFirst'),
    connect: connectionHandler => {
      return (0, _factories.createConnection)(parentLog, pool, clientConfiguration, 'EXPLICIT', (connectionLog, connection, boundConnection) => {
        return connectionHandler(boundConnection);
      }, newPool => {
        return newPool.connect(connectionHandler);
      });
    },
    copyFromBinary: (copyQuery, values, columnTypes) => {
      (0, _assertions.assertSqlSqlToken)(copyQuery);
      return (0, _factories.createConnection)(parentLog, pool, clientConfiguration, 'IMPLICIT_QUERY', (connectionLog, connection, boundConnection) => {
        return boundConnection.copyFromBinary(copyQuery, values, columnTypes);
      }, newPool => {
        return newPool.copyFromBinary(copyQuery, values, columnTypes);
      });
    },
    end: async () => {
      const terminateIdleClients = () => {
        const activeConnectionCount = pool.totalCount - pool.idleCount;

        if (activeConnectionCount === 0) {
          for (const client of pool._clients) {
            pool._remove(client);
          }
        }
      };

      pool.slonik.ended = true;
      return new Promise(resolve => {
        terminateIdleClients();
        pool.on('remove', () => {
          if (pool.totalCount === 0) {
            resolve();
          }
        });

        if (pool.totalCount === 0) {
          resolve();
        }
      });
    },
    getPoolState: () => {
      return {
        activeConnectionCount: pool.totalCount - pool.idleCount,
        ended: pool.slonik.ended,
        idleConnectionCount: pool.idleCount,
        waitingClientCount: pool.waitingCount
      };
    },
    many: mapConnection('many'),
    manyFirst: mapConnection('manyFirst'),
    maybeOne: mapConnection('maybeOne'),
    maybeOneFirst: mapConnection('maybeOneFirst'),
    one: mapConnection('one'),
    oneFirst: mapConnection('oneFirst'),
    query: mapConnection('query'),
    stream: (streamQuery, streamHandler) => {
      (0, _assertions.assertSqlSqlToken)(streamQuery);
      return (0, _factories.createConnection)(parentLog, pool, clientConfiguration, 'IMPLICIT_QUERY', (connectionLog, connection, boundConnection) => {
        return boundConnection.stream(streamQuery, streamHandler);
      }, newPool => {
        return newPool.stream(streamQuery, streamHandler);
      }, streamQuery);
    },
    transaction: async transactionHandler => {
      return (0, _factories.createConnection)(parentLog, pool, clientConfiguration, 'IMPLICIT_TRANSACTION', (connectionLog, connection) => {
        return (0, _connectionMethods.transaction)(connectionLog, connection, clientConfiguration, transactionHandler);
      }, newPool => {
        return newPool.transaction(transactionHandler);
      });
    }
  };
};

var _default = bindPool;
exports.default = _default;
//# sourceMappingURL=bindPool.js.map