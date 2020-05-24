"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _errors = require("../errors");

var _utilities = require("../utilities");

var _factories = require("../factories");

const createListSqlFragment = (token, greatestParameterPosition) => {
  const values = [];
  const placeholders = [];
  let placeholderIndex = greatestParameterPosition;

  if (token.members.length === 0) {
    throw new _errors.InvalidInputError('Value list must have at least 1 member.');
  }

  for (const member of token.members) {
    if ((0, _utilities.isSqlToken)(member)) {
      const sqlFragment = (0, _factories.createSqlTokenSqlFragment)(member, placeholderIndex);
      placeholders.push(sqlFragment.sql);
      placeholderIndex += sqlFragment.values.length;
      values.push(...sqlFragment.values);
    } else if ((0, _utilities.isPrimitiveValueExpression)(member)) {
      placeholders.push('$' + ++placeholderIndex);
      values.push(member);
    } else {
      throw new _errors.InvalidInputError('Invalid list member type. Must be a SQL token or a primitive value expression.');
    }
  }

  return {
    // $FlowFixMe
    sql: placeholders.join(token.glue.sql),
    values: (0, _factories.createPrimitiveValueExpressions)(values)
  };
};

var _default = createListSqlFragment;
exports.default = _default;
//# sourceMappingURL=createListSqlFragment.js.map