"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tokens = require("../tokens");

const Tokens = [_tokens.ArrayToken, _tokens.BinaryToken, _tokens.ComparisonPredicateToken, _tokens.IdentifierToken, _tokens.JsonToken, _tokens.ListToken, _tokens.SqlToken, _tokens.UnnestToken];

const isSqlToken = subject => {
  if (typeof subject !== 'object' || subject === null) {
    return false;
  }

  return Tokens.includes(subject.type);
};

var _default = isSqlToken;
exports.default = _default;
//# sourceMappingURL=isSqlToken.js.map