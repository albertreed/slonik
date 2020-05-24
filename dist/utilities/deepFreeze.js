"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// eslint-disable-next-line flowtype/no-weak-types
const isSubjectFreezable = subject => {
  return Boolean(subject !== null && (typeof subject === 'object' || typeof subject === 'function') && subject.constructor !== Buffer && !Object.isFrozen(subject));
};
/**
 * @see https://github.com/substack/deep-freeze/pull/9
 */
// eslint-disable-next-line flowtype/no-weak-types


const deepFreeze = subject => {
  if (!isSubjectFreezable(subject)) {
    return subject;
  }

  Object.freeze(subject);

  for (const property of Object.getOwnPropertyNames(subject)) {
    if (subject.hasOwnProperty(property) && isSubjectFreezable(subject[property])) {
      deepFreeze(subject[property]);
    }
  }

  return subject;
};

var _default = deepFreeze;
exports.default = _default;
//# sourceMappingURL=deepFreeze.js.map