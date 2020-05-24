"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pgTypes = require("pg-types");

var _typeOverrides = _interopRequireDefault(require("pg/lib/type-overrides"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createTypeOverrides = async (connection, typeParsers) => {
  const typeOverrides = new _typeOverrides.default();

  if (typeParsers.length === 0) {
    return typeOverrides;
  }

  const typeNames = typeParsers.map(typeParser => {
    return typeParser.name;
  });
  const postgresTypes = (await connection.query('SELECT oid, typarray, typname FROM pg_type WHERE typname = ANY($1::text[])', [typeNames])).rows;

  for (const typeParser of typeParsers) {
    const postgresType = postgresTypes.find(maybeTargetPostgresType => {
      return maybeTargetPostgresType.typname === typeParser.name;
    });

    if (!postgresType) {
      throw new Error('Database type "' + typeParser.name + '" not found.');
    }

    typeOverrides.setTypeParser(postgresType.oid, value => {
      return typeParser.parse(value);
    });

    if (postgresType.typarray) {
      typeOverrides.setTypeParser(postgresType.typarray, value => {
        return _pgTypes.arrayParser.create(value, typeParser.parse).parse();
      });
    }
  }

  return typeOverrides;
};

var _default = createTypeOverrides;
exports.default = _default;
//# sourceMappingURL=createTypeOverrides.js.map