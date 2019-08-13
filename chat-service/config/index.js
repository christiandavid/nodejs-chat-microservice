require('dotenv').config();

const bunyan = require('bunyan');
const pjs = require('../package.json');

const { name, version } = pjs;

const getLogger = (serviceName, serviceVersion, level) => bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level });

module.exports = {
  production: {
    name,
    version,
    log: () => getLogger(name, version, 'info'),
    serviceRegistryUrl: `http://${process.env.SVC_REGISTRY_HOST}:${process.env.SVC_REGISTRY_PORT}`,
    serviceVersionId: '1.0.0',
    db: {
      dsn: process.env.DB_DSN_PRODUCTION,
    },
  },
  development: {
    name,
    version,
    log: () => getLogger(name, version, 'debug'),
    serviceRegistryUrl: `http://${process.env.SVC_REGISTRY_HOST}:${process.env.SVC_REGISTRY_PORT}`,
    serviceVersionId: '1.0.0',
    db: {
      dsn: process.env.DB_DSN_DEVELOPMENT,
    },
  },
  test: {
    name,
    version,
    log: () => getLogger(name, version, 'fatal'),
    serviceRegistryUrl: `http://${process.env.SVC_REGISTRY_HOST}:${process.env.SVC_REGISTRY_PORT}`,
    serviceVersionId: '1.0.0',
    db: {
      dsn: process.env.DB_DSN_TEST,
    },
  },
};
