"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tokens = require("../tokens");

const mapTaggedTemplateLiteralInvocation = targetMethod => {
  return query => {
    if (query.type !== _tokens.SqlToken) {
      throw new TypeError('Query must be constructed using `sql` tagged template literal.');
    }

    return targetMethod(query.sql, query.values);
  };
};

var _default = mapTaggedTemplateLiteralInvocation;
exports.default = _default;
//# sourceMappingURL=mapTaggedTemplateLiteralInvocation.js.map