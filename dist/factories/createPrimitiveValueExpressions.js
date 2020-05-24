"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Logger = _interopRequireDefault(require("../Logger"));

var _errors = require("../errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const log = _Logger.default.child({
  namespace: 'createPrimitiveValueExpressions'
});

const createPrimitiveValueExpressions = values => {
  const primitiveValueExpressions = [];

  for (const value of values) {
    if (Array.isArray(value) || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
      primitiveValueExpressions.push(value);
    } else {
      log.warn({
        value,
        values
      }, 'unexpected value expression');
      throw new _errors.UnexpectedStateError('Unexpected value expression.');
    }
  }

  return primitiveValueExpressions;
};

var _default = createPrimitiveValueExpressions;
exports.default = _default;
//# sourceMappingURL=createPrimitiveValueExpressions.js.map