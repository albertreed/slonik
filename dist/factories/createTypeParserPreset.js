"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeParsers = require("./typeParsers");

const createTypeParserPreset = () => {
  return [(0, _typeParsers.createBigintTypeParser)(), (0, _typeParsers.createDateTypeParser)(), (0, _typeParsers.createIntervalTypeParser)(), (0, _typeParsers.createNumericTypeParser)(), (0, _typeParsers.createTimestampTypeParser)(), (0, _typeParsers.createTimestampWithTimeZoneTypeParser)()];
};

var _default = createTypeParserPreset;
exports.default = _default;
//# sourceMappingURL=createTypeParserPreset.js.map