"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const dateParser = value => {
  return value;
};

const createDateTypeParser = () => {
  return {
    name: 'date',
    parse: dateParser
  };
};

var _default = createDateTypeParser;
exports.default = _default;
//# sourceMappingURL=createDateTypeParser.js.map