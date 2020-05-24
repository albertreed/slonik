"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const createMockQueryResult = rows => {
  return {
    command: 'SELECT',
    fields: [],
    notices: [],
    rowCount: rows.length,
    rows
  };
};

var _default = createMockQueryResult;
exports.default = _default;
//# sourceMappingURL=createMockQueryResult.js.map