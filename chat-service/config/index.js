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
  },
  development: {
    name,
    version,
    log: () => getLogger(name, version, 'debug'),
  },
  test: {
    name,
    version,
    log: () => getLogger(name, version, 'fatal'),
  },
};
