"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utilities = require("../utilities");

var _Logger = _interopRequireDefault(require("../Logger"));

var _bindPool = _interopRequireDefault(require("../binders/bindPool"));

var _createClientConfiguration = _interopRequireDefault(require("./createClientConfiguration"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createMockPool = (overrides, clientConfigurationInput) => {
  const clientConfiguration = (0, _createClientConfiguration.default)(clientConfigurationInput);
  const poolId = (0, _utilities.createUlid)();

  const poolLog = _Logger.default.child({
    poolId
  });

  const pool = {
    connect: () => {
      const connection = {
        connection: {
          slonik: {
            connectionId: (0, _utilities.createUlid)(),
            mock: true,
            terminated: null,
            transactionDepth: null
          }
        },
        off: () => {},
        on: () => {},
        query: overrides.query,
        release: () => {}
      };
      return connection;
    },
    slonik: {
      ended: false,
      mock: true,
      poolId,
      typeOverrides: null
    }
  };
  return (0, _bindPool.default)(poolLog, pool, clientConfiguration);
};

var _default = createMockPool;
exports.default = _default;
//# sourceMappingURL=createMockPool.js.map