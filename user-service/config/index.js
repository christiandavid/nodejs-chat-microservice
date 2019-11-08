require('dotenv').config();

const bunyan = require('bunyan');
const pjs = require('../package.json');

const { name, version } = pjs;

const getLogger = (serviceName, serviceVersion, level) =>
  bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level });

module.exports = {
  production: {
    name,
    version,
    log: () => getLogger(name, version, 'info'),
    db: {
      dsn: process.env.DB_DSN_PRODUCTION,
    },
  },
  development: {
    name,
    version,
    log: () => getLogger(name, version, 'debug'),
    db: {
      dsn: process.env.DB_DSN_DEVELOPMENT,
    },
  },
  test: {
    name,
    version,
    log: () => getLogger(name, version, 'fatal'),
    db: {
      dsn: process.env.DB_DSN_TEST,
    },
  },
};
