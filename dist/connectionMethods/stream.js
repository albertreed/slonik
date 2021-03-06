"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _through = _interopRequireDefault(require("through2"));

var _routines = require("../routines");

var _QueryStream = _interopRequireDefault(require("../QueryStream"));

var _errors = require("../errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable promise/prefer-await-to-callbacks */
const stream = async (connectionLogger, connection, clientConfiguration, rawSql, values, streamHandler) => {
  return (0, _routines.executeQuery)(connectionLogger, connection, clientConfiguration, rawSql, values, undefined, (finalConnection, finalSql, finalValues, executionContext, actualQuery) => {
    if (connection.connection.slonik.native) {
      throw new _errors.UnexpectedStateError('Result cursors do not work with the native driver. Use JavaScript driver.');
    }

    const query = new _QueryStream.default(finalSql, finalValues);
    const queryStream = finalConnection.query(query);
    const rowTransformers = [];

    for (const interceptor of clientConfiguration.interceptors) {
      if (interceptor.transformRow) {
        rowTransformers.push(interceptor.transformRow);
      }
    }

    return new Promise((resolve, reject) => {
      queryStream.on('error', error => {
        reject(error);
      });
      const transformedStream = queryStream.pipe(_through.default.obj(function (datum, enc, callback) {
        let finalRow = datum.row;

        if (rowTransformers.length) {
          for (const rowTransformer of rowTransformers) {
            finalRow = rowTransformer(executionContext, actualQuery, finalRow, datum.fields);
          }
        } // eslint-disable-next-line fp/no-this, babel/no-invalid-this


        this.push({
          fields: datum.fields,
          row: finalRow
        });
        callback();
      }));
      transformedStream.on('end', () => {
        // $FlowFixMe
        resolve({});
      }); // Invoked if stream is destroyed using transformedStream.destroy().

      transformedStream.on('close', () => {
        // $FlowFixMe
        resolve({});
      });
      streamHandler(transformedStream);
    });
  });
};

var _default = stream;
exports.default = _default;
//# sourceMappingURL=stream.js.map