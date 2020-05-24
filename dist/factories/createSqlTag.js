"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utilities = require("../utilities");

var _Logger = _interopRequireDefault(require("../Logger"));

var _tokens = require("../tokens");

var _errors = require("../errors");

var _createSqlTokenSqlFragment = _interopRequireDefault(require("./createSqlTokenSqlFragment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const log = _Logger.default.child({
  namespace: 'sql'
});

const createSqlTag = () => {
  /* eslint-disable complexity */
  // $FlowFixMe
  const sql = (parts, ...values) => {
    let rawSql = '';
    const parameterValues = [];
    let index = 0;

    for (const part of parts) {
      const token = values[index++];
      rawSql += part;

      if (index >= parts.length) {
        continue;
      }

      if (token === undefined) {
        log.debug({
          index,
          values
        }, 'bound values');
        throw new _errors.InvalidInputError('SQL tag cannot be bound an undefined value.');
      } else if ((0, _utilities.isPrimitiveValueExpression)(token)) {
        rawSql += '$' + (parameterValues.length + 1);
        parameterValues.push(token);
      } else if ((0, _utilities.isSqlToken)(token)) {
        // $FlowFixMe
        const sqlFragment = (0, _createSqlTokenSqlFragment.default)(token, parameterValues.length);
        rawSql += sqlFragment.sql;
        parameterValues.push(...sqlFragment.values);
      } else {
        log.error({
          constructedSql: rawSql,
          index,
          offendingToken: token
        }, 'unexpected value expression');
        throw new TypeError('Unexpected value expression.');
      }
    }

    const query = (0, _utilities.deepFreeze)({
      sql: rawSql,
      type: _tokens.SqlToken,
      values: parameterValues
    });
    return query;
  };

  sql.array = (values, memberType) => {
    return (0, _utilities.deepFreeze)({
      memberType,
      type: _tokens.ArrayToken,
      values
    });
  };

  sql.binary = data => {
    return (0, _utilities.deepFreeze)({
      data,
      type: _tokens.BinaryToken
    });
  };

  sql.identifier = names => {
    // @todo Replace `type` with a symbol once Flow adds symbol support
    // @see https://github.com/facebook/flow/issues/810
    return (0, _utilities.deepFreeze)({
      names,
      type: _tokens.IdentifierToken
    });
  };

  sql.json = value => {
    return (0, _utilities.deepFreeze)({
      type: _tokens.JsonToken,
      value
    });
  };

  sql.join = (members, glue) => {
    return (0, _utilities.deepFreeze)({
      glue,
      members,
      type: _tokens.ListToken
    });
  };

  sql.unnest = (tuples, columnTypes) => {
    return (0, _utilities.deepFreeze)({
      columnTypes,
      tuples,
      type: _tokens.UnnestToken
    });
  };

  return sql;
};

var _default = createSqlTag;
exports.default = _default;
//# sourceMappingURL=createSqlTag.js.map