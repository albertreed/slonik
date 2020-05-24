"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tokens = require("../tokens");

var _sqlFragmentFactories = require("../sqlFragmentFactories");

var _errors = require("../errors");

const createSqlTokenSqlFragment = (token, greatestParameterPosition) => {
  if (token.type === _tokens.ArrayToken) {
    return (0, _sqlFragmentFactories.createArraySqlFragment)(token, greatestParameterPosition);
  } else if (token.type === _tokens.BinaryToken) {
    return (0, _sqlFragmentFactories.createBinarySqlFragment)(token, greatestParameterPosition);
  } else if (token.type === _tokens.IdentifierToken) {
    return (0, _sqlFragmentFactories.createIdentifierSqlFragment)(token);
  } else if (token.type === _tokens.JsonToken) {
    return (0, _sqlFragmentFactories.createJsonSqlFragment)(token, greatestParameterPosition);
  } else if (token.type === _tokens.ListToken) {
    return (0, _sqlFragmentFactories.createListSqlFragment)(token, greatestParameterPosition);
  } else if (token.type === _tokens.SqlToken) {
    return (0, _sqlFragmentFactories.createSqlSqlFragment)(token, greatestParameterPosition);
  } else if (token.type === _tokens.UnnestToken) {
    return (0, _sqlFragmentFactories.createUnnestSqlFragment)(token, greatestParameterPosition);
  }

  throw new _errors.UnexpectedStateError();
};

var _default = createSqlTokenSqlFragment;
exports.default = _default;
//# sourceMappingURL=createSqlTokenSqlFragment.js.map