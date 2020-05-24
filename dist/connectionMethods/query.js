"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _routines = require("../routines");

const query = async (connectionLogger, connection, clientConfiguration, rawSql, values, inheritedQueryId) => {
  // $FlowFixMe
  return (0, _routines.executeQuery)(connectionLogger, connection, clientConfiguration, rawSql, values, inheritedQueryId, async (finalConnection, finalSql, finalValues) => {
    const result = await finalConnection.query(finalSql, finalValues);

    const _iterable = result.fields || [];

    let _result = [];

    for (let _key = 0, _length = _iterable.length, _value; _key < _length; ++_key) {
      _value = _iterable[_key];
      _result[_key] = {
        dataTypeId: _value.dataTypeID,
        name: _value.name
      };
    }

    return {
      command: result.command,
      fields: _result,
      notices: result.notices || [],
      rowCount: result.rowCount || 0,
      rows: result.rows || []
    };
  });
};

var _default = query;
exports.default = _default;
//# sourceMappingURL=query.js.map