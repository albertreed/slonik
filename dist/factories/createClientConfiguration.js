"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _errors = require("../errors");

var _createTypeParserPreset = _interopRequireDefault(require("./createTypeParserPreset"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createClientConfiguration = clientUserConfigurationInput => {
  const typeParsers = [];
  const configuration = {
    captureStackTrace: true,
    connectionRetryLimit: 3,
    connectionTimeout: 5000,
    idleInTransactionSessionTimeout: 60000,
    idleTimeout: 5000,
    // $FlowFixMe
    interceptors: [],
    maximumPoolSize: 10,
    preferNativeBindings: true,
    statementTimeout: 60000,
    transactionRetryLimit: 5,
    typeParsers,
    // $FlowFixMe
    ...clientUserConfigurationInput
  };

  if (configuration.maximumPoolSize < 1) {
    throw new _errors.InvalidConfigurationError('maximumPoolSize must be equal to or greater than 1.');
  }

  if (!configuration.typeParsers || configuration.typeParsers === typeParsers) {
    // $FlowFixMe
    configuration.typeParsers = (0, _createTypeParserPreset.default)();
  }

  return configuration;
};

var _default = createClientConfiguration;
exports.default = _default;
//# sourceMappingURL=createClientConfiguration.js.map