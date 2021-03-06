"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utilities = require("../utilities");

var _errors = require("../errors");

const createUnnestSqlFragment = (token, greatestParameterPosition) => {
  const columnTypes = token.columnTypes;
  const values = [];
  const unnestBindings = [];
  const unnestSqlTokens = [];
  let columnIndex = 0;
  let placeholderIndex = greatestParameterPosition;

  while (columnIndex < columnTypes.length) {
    const columnType = columnTypes[columnIndex];
    unnestSqlTokens.push('$' + ++placeholderIndex + '::' + (0, _utilities.escapeIdentifier)((0, _utilities.stripArrayNotation)(columnType)) + '[]'.repeat((0, _utilities.countArrayDimensions)(columnType) + 1));
    unnestBindings[columnIndex] = [];
    columnIndex++;
  }

  let lastTupleSize;

  for (const tupleValues of token.tuples) {
    if (typeof lastTupleSize === 'number' && lastTupleSize !== tupleValues.length) {
      throw new Error('Each tuple in a list of tuples must have an equal number of members.');
    }

    if (tupleValues.length !== columnTypes.length) {
      throw new Error('Column types length must match tuple member length.');
    }

    lastTupleSize = tupleValues.length;
    let tupleColumnIndex = 0;

    for (const tupleValue of tupleValues) {
      if (!Array.isArray(tupleValue) && !(0, _utilities.isPrimitiveValueExpression)(tupleValue) && !Buffer.isBuffer(tupleValue)) {
        throw new _errors.InvalidInputError('Invalid unnest tuple member type. Must be a primitive value expression.');
      }

      unnestBindings[tupleColumnIndex++].push(tupleValue);
    }
  }

  values.push(...unnestBindings);
  const sql = 'unnest(' + unnestSqlTokens.join(', ') + ')';
  return {
    sql,
    values
  };
};

var _default = createUnnestSqlFragment;
exports.default = _default;
//# sourceMappingURL=createUnnestSqlFragment.js.map