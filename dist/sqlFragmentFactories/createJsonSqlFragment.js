"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _serializeError = require("serialize-error");

var _isPlainObject = _interopRequireDefault(require("is-plain-object"));

var _errors = require("../errors");

var _Logger = _interopRequireDefault(require("../Logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const log = _Logger.default.child({
  namespace: 'createJsonSqlFragment'
});

const createJsonSqlFragment = (token, greatestParameterPosition) => {
  let value;

  if (token.value === undefined) {
    throw new _errors.InvalidInputError('JSON payload must not be undefined.');
  } else if (token.value === null) {
    value = token.value; // @todo Deep check Array.
    // eslint-disable-next-line no-negated-condition
  } else if (!(0, _isPlainObject.default)(token.value) && !Array.isArray(token.value) && !['number', 'string', 'boolean'].includes(typeof token.value)) {
    throw new _errors.InvalidInputError('JSON payload must be a primitive value or a plain object.');
  } else {
    try {
      value = JSON.stringify(token.value);
    } catch (error) {
      log.error({
        error: (0, _serializeError.serializeError)(error)
      }, 'payload cannot be stringified');
      throw new _errors.InvalidInputError('JSON payload cannot be stringified.');
    }

    if (value === undefined) {
      throw new _errors.InvalidInputError('JSON payload cannot be stringified. The resulting value is undefined.');
    }
  } // Do not add `::json` as it will fail if an attempt is made to insert to jsonb-type column.


  return {
    sql: '$' + (greatestParameterPosition + 1),
    values: [value]
  };
};

var _default = createJsonSqlFragment;
exports.default = _default;
//# sourceMappingURL=createJsonSqlFragment.js.map