"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utilities = require("../utilities");

var _factories = require("../factories");

var _errors = require("../errors");

const createArraySqlFragment = (token, greatestParameterPosition) => {
  let placeholderIndex = greatestParameterPosition;

  for (const value of token.values) {
    if (!(0, _utilities.isPrimitiveValueExpression)(value)) {
      throw new _errors.InvalidInputError('Invalid array member type. Must be a primitive value expression.');
    }
  }

  const values = [token.values];
  placeholderIndex++;
  let sql = '$' + placeholderIndex + '::';

  if ((0, _utilities.isSqlToken)(token.memberType) && token.memberType.type === 'SLONIK_TOKEN_SQL') {
    // $FlowFixMe
    const sqlFragment = (0, _factories.createSqlTokenSqlFragment)(token.memberType, placeholderIndex);
    placeholderIndex += sqlFragment.values.length;
    values.push(...sqlFragment.values);
    sql += sqlFragment.sql;
  } else if (typeof token.memberType === 'string') {
    sql += (0, _utilities.escapeIdentifier)(token.memberType) + '[]';
  } else {
    throw new _errors.InvalidInputError('Unsupported `memberType`. `memberType` must be a string or SqlToken of "SLONIK_TOKEN_SQL" type.');
  }

  return {
    sql,
    // $FlowFixMe
    values
  };
};

var _default = createArraySqlFragment;
exports.default = _default;
//# sourceMappingURL=createArraySqlFragment.js.map