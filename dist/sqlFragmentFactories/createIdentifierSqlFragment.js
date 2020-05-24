"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utilities = require("../utilities");

var _errors = require("../errors");

const createIdentifierSqlFragment = token => {
  const sql = token.names.map(identifierName => {
    if (typeof identifierName !== 'string') {
      throw new _errors.InvalidInputError('Identifier name array member type must be a string.');
    }

    return (0, _utilities.escapeIdentifier)(identifierName);
  }).join('.');
  return {
    sql,
    values: []
  };
};

var _default = createIdentifierSqlFragment;
exports.default = _default;
//# sourceMappingURL=createIdentifierSqlFragment.js.map