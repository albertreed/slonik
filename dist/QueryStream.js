"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _stream = require("stream");

var _pgCursor = _interopRequireDefault(require("pg-cursor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable fp/no-class, fp/no-this, id-match, flowtype/no-weak-types, promise/prefer-await-to-callbacks */

/**
 * @see https://github.com/brianc/node-pg-query-stream
 * @see https://github.com/brianc/node-pg-query-stream/issues/51
 */
class QueryStream extends _stream.Readable {
  // $FlowFixMe
  constructor(text, values, options) {
    super({
      objectMode: true,
      ...options
    });
    this.cursor = new _pgCursor.default(text, values);
    this._reading = false;
    this._closed = false;
    this.batchSize = (options || {}).batchSize || 100; // delegate Submittable callbacks to cursor

    this.handleRowDescription = this.cursor.handleRowDescription.bind(this.cursor);
    this.handleDataRow = this.cursor.handleDataRow.bind(this.cursor);
    this.handlePortalSuspended = this.cursor.handlePortalSuspended.bind(this.cursor);
    this.handleCommandComplete = this.cursor.handleCommandComplete.bind(this.cursor);
    this.handleReadyForQuery = this.cursor.handleReadyForQuery.bind(this.cursor);
    this.handleError = this.cursor.handleError.bind(this.cursor);
  }

  submit(connection) {
    this.cursor.submit(connection);
  }

  close(callback) {
    this._closed = true;

    const close = () => {
      this.emit('close');
    };

    this.cursor.close(callback || close);
  } // $FlowFixMe


  _read(size) {
    if (this._reading || this._closed) {
      return;
    }

    this._reading = true;
    const readAmount = Math.max(size, this.batchSize);
    this.cursor.read(readAmount, (error, rows, result) => {
      if (this._closed) {
        return;
      }

      if (error) {
        this.emit('error', error);
        return;
      }

      if (!rows.length) {
        this._closed = true;
        setImmediate(() => {
          this.emit('close');
        });
        this.push(null);
        return;
      } // push each row into the stream


      this._reading = false;

      for (const row of rows) {
        const _iterable = result.fields || [];

        let _result = [];

        for (let _key = 0, _length = _iterable.length, _value; _key < _length; ++_key) {
          _value = _iterable[_key];
          _result[_key] = {
            dataTypeId: _value.dataTypeID,
            name: _value.name
          };
        }

        // $FlowFixMe
        this.push({
          fields: _result,
          row
        });
      }
    });
  }

}

exports.default = QueryStream;
//# sourceMappingURL=QueryStream.js.map