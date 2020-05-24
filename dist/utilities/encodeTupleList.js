"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _stream = require("stream");

var _concatStream = _interopRequireDefault(require("concat-stream"));

var _pgCopyStreamsBinary = require("pg-copy-streams-binary");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const encodeTupleList = (tupleList, columnTypes) => {
  return new Promise((resolve, reject) => {
    const concatStream = (0, _concatStream.default)(payloadBuffer => {
      resolve(payloadBuffer);
    });
    const encode = (0, _pgCopyStreamsBinary.deparser)();
    const tupleStream = new _stream.Readable({
      objectMode: true
    });
    tupleStream.pipe(encode).pipe(concatStream).on('error', error => {
      reject(error);
    });
    let lastTupleSize;

    for (const tuple of tupleList) {
      if (typeof lastTupleSize === 'number' && lastTupleSize !== tuple.length) {
        throw new Error('Each tuple in a list of tuples must have an equal number of members.');
      }

      if (tuple.length !== columnTypes.length) {
        throw new Error('Column types length must match tuple member length.');
      }

      lastTupleSize = tuple.length;
      const payload = new Array(lastTupleSize);
      let tupleColumnIndex = -1;

      while (tupleColumnIndex++ < lastTupleSize - 1) {
        payload[tupleColumnIndex] = {
          type: columnTypes[tupleColumnIndex],
          value: tuple[tupleColumnIndex]
        };
      } // $FlowFixMe


      tupleStream.push(payload);
    }

    tupleStream.push(null);
  });
};

var _default = encodeTupleList;
exports.default = _default;
//# sourceMappingURL=encodeTupleList.js.map