"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _errors = require("../errors");

const createBinarySqlFragment = (token, greatestParameterPosition) => {
  if (!Buffer.isBuffer(token.data)) {
    throw new _errors.InvalidInputError('Binary value must be a buffer.');
  }

  return {
    sql: '$' + (greatestParameterPosition + 1),
    values: [// $FlowFixMe
    token.data]
  };
};

var _default = createBinarySqlFragment;
exports.default = _default;
//# sourceMappingURL=createBinarySqlFragment.js.map