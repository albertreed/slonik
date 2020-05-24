"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utilities = require("../utilities");

var _errors = require("../errors");

var _any = _interopRequireDefault(require("./any"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const anyFirst = async (log, connection, clientConfigurationType, rawSql, values, inheritedQueryId) => {
  const queryId = inheritedQueryId || (0, _utilities.createQueryId)();
  const rows = await (0, _any.default)(log, connection, clientConfigurationType, rawSql, values, queryId);

  if (rows.length === 0) {
    return [];
  }

  const firstRow = rows[0];
  const keys = Object.keys(firstRow);

  if (keys.length !== 1) {
    log.error({
      queryId
    }, 'result row has no columns');
    throw new _errors.DataIntegrityError();
  }

  const firstColumnName = keys[0];
  let _result = [];

  for (let _key = 0, _length = rows.length, _value; _key < _length; ++_key) {
    _value = rows[_key];
    _result[_key] = _value[firstColumnName];
  }

  return _result;
};

var _default = anyFirst;
exports.default = _default;
//# sourceMappingURL=anyFirst.js.map