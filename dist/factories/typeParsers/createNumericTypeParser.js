"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const numericParser = value => {
  return parseFloat(value);
};

const createNumericTypeParser = () => {
  return {
    name: 'numeric',
    parse: numericParser
  };
};

var _default = createNumericTypeParser;
exports.default = _default;
//# sourceMappingURL=createNumericTypeParser.js.map