"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _stream = require("stream");

var _pgCopyStreams = require("pg-copy-streams");

var _routines = require("../routines");

var _utilities = require("../utilities");

var _errors = require("../errors");

const bufferToStream = buffer => {
  const stream = new _stream.Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

const copyFromBinary = async (connectionLogger, connection, clientConfiguration, rawSql, boundValues, tupleList, columnTypes) => {
  if (connection.connection.slonik.native) {
    throw new _errors.UnexpectedStateError('COPY streams do not work with the native driver. Use JavaScript driver.');
  }

  const payloadBuffer = await (0, _utilities.encodeTupleList)(tupleList, columnTypes);
  return (0, _routines.executeQuery)(connectionLogger, connection, clientConfiguration, rawSql, boundValues, undefined, (finalConnection, finalSql) => {
    const copyFromBinaryStream = finalConnection.query((0, _pgCopyStreams.from)(finalSql));
    bufferToStream(payloadBuffer).pipe(copyFromBinaryStream);
    return new Promise((resolve, reject) => {
      copyFromBinaryStream.on('error', error => {
        reject(error);
      });
      copyFromBinaryStream.on('end', () => {
        // $FlowFixMe
        resolve({});
      });
    });
  });
};

var _default = copyFromBinary;
exports.default = _default;
//# sourceMappingURL=copyFromBinary.js.map