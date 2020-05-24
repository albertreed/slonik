"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckIntegrityConstraintViolationError = exports.UniqueIntegrityConstraintViolationError = exports.ForeignKeyIntegrityConstraintViolationError = exports.NotNullIntegrityConstraintViolationError = exports.IntegrityConstraintViolationError = exports.DataIntegrityError = exports.NotFoundError = exports.BackendTerminatedError = exports.StatementTimeoutError = exports.StatementCancelledError = exports.ConnectionError = exports.UnexpectedStateError = exports.InvalidInputError = exports.InvalidConfigurationError = exports.SlonikError = void 0;

var _es6Error = _interopRequireDefault(require("es6-error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable fp/no-class, fp/no-this */
class SlonikError extends _es6Error.default {}

exports.SlonikError = SlonikError;

class InvalidConfigurationError extends SlonikError {}

exports.InvalidConfigurationError = InvalidConfigurationError;

class InvalidInputError extends SlonikError {}

exports.InvalidInputError = InvalidInputError;

class UnexpectedStateError extends SlonikError {}

exports.UnexpectedStateError = UnexpectedStateError;

class ConnectionError extends SlonikError {}

exports.ConnectionError = ConnectionError;

class StatementCancelledError extends SlonikError {
  constructor(error) {
    super();
    this.originalError = error;
    this.message = 'Statement has been cancelled.';
  }

}

exports.StatementCancelledError = StatementCancelledError;

class StatementTimeoutError extends StatementCancelledError {
  constructor(error) {
    super(error);
    this.message = 'Statement has been cancelled due to a statement_timeout.';
  }

}

exports.StatementTimeoutError = StatementTimeoutError;

class BackendTerminatedError extends SlonikError {
  constructor(error) {
    super();
    this.originalError = error;
    this.message = 'Backend has been terminated.';
  }

}

exports.BackendTerminatedError = BackendTerminatedError;

class NotFoundError extends SlonikError {
  constructor() {
    super('Resource not found.');
  }

}

exports.NotFoundError = NotFoundError;

class DataIntegrityError extends SlonikError {
  constructor() {
    super('Query returns an unexpected result.');
  }

}

exports.DataIntegrityError = DataIntegrityError;

class IntegrityConstraintViolationError extends SlonikError {
  constructor(error, constraint) {
    super();
    this.originalError = error;
    this.constraint = constraint;
  }

} // @todo When does restrict_violation and exclusion_violation happen?
// @see https://www.postgresql.org/docs/9.4/static/errcodes-appendix.html


exports.IntegrityConstraintViolationError = IntegrityConstraintViolationError;

class NotNullIntegrityConstraintViolationError extends IntegrityConstraintViolationError {
  constructor(error, constraint) {
    super(error, constraint);
    this.originalError = error;
    this.message = 'Query violates a not NULL integrity constraint.';
  }

}

exports.NotNullIntegrityConstraintViolationError = NotNullIntegrityConstraintViolationError;

class ForeignKeyIntegrityConstraintViolationError extends IntegrityConstraintViolationError {
  constructor(error, constraint) {
    super(error, constraint);
    this.originalError = error;
    this.message = 'Query violates a foreign key integrity constraint.';
  }

}

exports.ForeignKeyIntegrityConstraintViolationError = ForeignKeyIntegrityConstraintViolationError;

class UniqueIntegrityConstraintViolationError extends IntegrityConstraintViolationError {
  constructor(error, constraint) {
    super(error, constraint);
    this.originalError = error;
    this.message = 'Query violates a unique integrity constraint.';
  }

}

exports.UniqueIntegrityConstraintViolationError = UniqueIntegrityConstraintViolationError;

class CheckIntegrityConstraintViolationError extends IntegrityConstraintViolationError {
  constructor(error, constraint) {
    super(error, constraint);
    this.originalError = error;
    this.message = 'Query violates a check integrity constraint.';
  }

}

exports.CheckIntegrityConstraintViolationError = CheckIntegrityConstraintViolationError;
//# sourceMappingURL=errors.js.map