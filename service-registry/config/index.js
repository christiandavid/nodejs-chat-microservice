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
    serviceTimeout: process.env.SERVICE_TIMEOUT,
    log: () => getLogger(name, version, 'info'),
  },
  development: {
    name,
    version,
    serviceTimeout: process.env.SERVICE_TIMEOUT,
    log: () => getLogger(name, version, 'debug'),
  },
  test: {
    name,
    version,
    serviceTimeout: process.env.SERVICE_TIMEOUT,
    log: () => getLogger(name, version, 'fatal'),
  },
};
