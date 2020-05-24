"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utilities = require("../utilities");

var _connectionMethods = require("../connectionMethods");

var _assertions = require("../assertions");

const bindPoolConnection = (parentLog, connection, clientConfiguration) => {
  return {
    any: (0, _utilities.mapTaggedTemplateLiteralInvocation)(_connectionMethods.any.bind(null, parentLog, connection, clientConfiguration)),
    anyFirst: (0, _utilities.mapTaggedTemplateLiteralInvocation)(_connectionMethods.anyFirst.bind(null, parentLog, connection, clientConfiguration)),
    copyFromBinary: async (copyQuery, values, columnTypes) => {
      (0, _assertions.assertSqlSqlToken)(copyQuery);
      return (0, _connectionMethods.copyFromBinary)(parentLog, connection, clientConfiguration, copyQuery.sql, copyQuery.values, values, columnTypes);
    },
    many: (0, _utilities.mapTaggedTemplateLiteralInvocation)(_connectionMethods.many.bind(null, parentLog, connection, clientConfiguration)),
    manyFirst: (0, _utilities.mapTaggedTemplateLiteralInvocation)(_connectionMethods.manyFirst.bind(null, parentLog, connection, clientConfiguration)),
    maybeOne: (0, _utilities.mapTaggedTemplateLiteralInvocation)(_connectionMethods.maybeOne.bind(null, parentLog, connection, clientConfiguration)),
    maybeOneFirst: (0, _utilities.mapTaggedTemplateLiteralInvocation)(_connectionMethods.maybeOneFirst.bind(null, parentLog, connection, clientConfiguration)),
    one: (0, _utilities.mapTaggedTemplateLiteralInvocation)(_connectionMethods.one.bind(null, parentLog, connection, clientConfiguration)),
    oneFirst: (0, _utilities.mapTaggedTemplateLiteralInvocation)(_connectionMethods.oneFirst.bind(null, parentLog, connection, clientConfiguration)),
    query: (0, _utilities.mapTaggedTemplateLiteralInvocation)(_connectionMethods.query.bind(null, parentLog, connection, clientConfiguration)),
    stream: async (streamQuery, streamHandler) => {
      (0, _assertions.assertSqlSqlToken)(streamQuery);
      return (0, _connectionMethods.stream)(parentLog, connection, clientConfiguration, streamQuery.sql, streamQuery.values, streamHandler);
    },
    transaction: async handler => {
      return (0, _connectionMethods.transaction)(parentLog, connection, clientConfiguration, handler);
    }
  };
};

var _default = bindPoolConnection;
exports.default = _default;
//# sourceMappingURL=bindPoolConnection.js.map