"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const normaliseQueryValues = (queryValues, native) => {
  if (native && queryValues) {
    const finalValues = [];

    for (const value of queryValues) {
      // Property handle binary/ bytea inserts.
      // @see https://github.com/brianc/node-postgres/issues/980
      // @see https://github.com/brianc/node-pg-native/issues/83
      if (Buffer.isBuffer(value)) {
        // $FlowFixMe
        finalValues.push('\\x' + value.toString('hex'));
      } else {
        finalValues.push(value);
      }
    }

    return finalValues;
  }

  return queryValues;
};

var _default = normaliseQueryValues;
exports.default = _default;
//# sourceMappingURL=normaliseQueryValues.js.map