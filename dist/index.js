"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  sql: true,
  createMockPool: true,
  createMockQueryResult: true,
  createPool: true,
  createSqlTag: true,
  createSqlTokenSqlFragment: true,
  createTypeParserPreset: true,
  isSqlToken: true,
  BackendTerminatedError: true,
  CheckIntegrityConstraintViolationError: true,
  ConnectionError: true,
  DataIntegrityError: true,
  ForeignKeyIntegrityConstraintViolationError: true,
  IntegrityConstraintViolationError: true,
  InvalidConfigurationError: true,
  InvalidInputError: true,
  NotFoundError: true,
  NotNullIntegrityConstraintViolationError: true,
  SlonikError: true,
  StatementCancelledError: true,
  StatementTimeoutError: true,
  UnexpectedStateError: true,
  UniqueIntegrityConstraintViolationError: true
};
Object.defineProperty(exports, "createMockPool", {
  enumerable: true,
  get: function () {
    return _factories.createMockPool;
  }
});
Object.defineProperty(exports, "createMockQueryResult", {
  enumerable: true,
  get: function () {
    return _factories.createMockQueryResult;
  }
});
Object.defineProperty(exports, "createPool", {
  enumerable: true,
  get: function () {
    return _factories.createPool;
  }
});
Object.defineProperty(exports, "createSqlTag", {
  enumerable: true,
  get: function () {
    return _factories.createSqlTag;
  }
});
Object.defineProperty(exports, "createSqlTokenSqlFragment", {
  enumerable: true,
  get: function () {
    return _factories.createSqlTokenSqlFragment;
  }
});
Object.defineProperty(exports, "createTypeParserPreset", {
  enumerable: true,
  get: function () {
    return _factories.createTypeParserPreset;
  }
});
Object.defineProperty(exports, "isSqlToken", {
  enumerable: true,
  get: function () {
    return _utilities.isSqlToken;
  }
});
Object.defineProperty(exports, "BackendTerminatedError", {
  enumerable: true,
  get: function () {
    return _errors.BackendTerminatedError;
  }
});
Object.defineProperty(exports, "CheckIntegrityConstraintViolationError", {
  enumerable: true,
  get: function () {
    return _errors.CheckIntegrityConstraintViolationError;
  }
});
Object.defineProperty(exports, "ConnectionError", {
  enumerable: true,
  get: function () {
    return _errors.ConnectionError;
  }
});
Object.defineProperty(exports, "DataIntegrityError", {
  enumerable: true,
  get: function () {
    return _errors.DataIntegrityError;
  }
});
Object.defineProperty(exports, "ForeignKeyIntegrityConstraintViolationError", {
  enumerable: true,
  get: function () {
    return _errors.ForeignKeyIntegrityConstraintViolationError;
  }
});
Object.defineProperty(exports, "IntegrityConstraintViolationError", {
  enumerable: true,
  get: function () {
    return _errors.IntegrityConstraintViolationError;
  }
});
Object.defineProperty(exports, "InvalidConfigurationError", {
  enumerable: true,
  get: function () {
    return _errors.InvalidConfigurationError;
  }
});
Object.defineProperty(exports, "InvalidInputError", {
  enumerable: true,
  get: function () {
    return _errors.InvalidInputError;
  }
});
Object.defineProperty(exports, "NotFoundError", {
  enumerable: true,
  get: function () {
    return _errors.NotFoundError;
  }
});
Object.defineProperty(exports, "NotNullIntegrityConstraintViolationError", {
  enumerable: true,
  get: function () {
    return _errors.NotNullIntegrityConstraintViolationError;
  }
});
Object.defineProperty(exports, "SlonikError", {
  enumerable: true,
  get: function () {
    return _errors.SlonikError;
  }
});
Object.defineProperty(exports, "StatementCancelledError", {
  enumerable: true,
  get: function () {
    return _errors.StatementCancelledError;
  }
});
Object.defineProperty(exports, "StatementTimeoutError", {
  enumerable: true,
  get: function () {
    return _errors.StatementTimeoutError;
  }
});
Object.defineProperty(exports, "UnexpectedStateError", {
  enumerable: true,
  get: function () {
    return _errors.UnexpectedStateError;
  }
});
Object.defineProperty(exports, "UniqueIntegrityConstraintViolationError", {
  enumerable: true,
  get: function () {
    return _errors.UniqueIntegrityConstraintViolationError;
  }
});
exports.sql = void 0;

var _factories = require("./factories");

var _utilities = require("./utilities");

var _typeParsers = require("./factories/typeParsers");

Object.keys(_typeParsers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _typeParsers[key];
    }
  });
});

var _errors = require("./errors");

const sql = (0, _factories.createSqlTag)();
exports.sql = sql;
//# sourceMappingURL=index.js.map