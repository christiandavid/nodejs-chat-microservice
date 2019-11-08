require('dotenv').config();
const bunyan = require('bunyan');

const loggers = {
  production: () => bunyan.createLogger({ name: 'production', level: 'info' }),
  development: () =>
    bunyan.createLogger({ name: 'development', level: 'debug' }),
  test: () => bunyan.createLogger({ name: 'test', level: 'fatal' }),
};

module.exports = {
  production: {
    siteName: 'ChatApp',
    log: loggers.production,
    serviceRegistryUrl: `http://${process.env.SVC_REGISTRY_HOST}:${process.env.SVC_REGISTRY_PORT}`,
    serviceVersionId: '1.0.0',
  },
  development: {
    siteName: 'ChatApp [Development]',
    log: loggers.development,
    serviceRegistryUrl: `http://${process.env.SVC_REGISTRY_HOST}:${process.env.SVC_REGISTRY_PORT}`,
    serviceVersionId: '1.0.0',
  },
  test: {
    siteName: 'ChatApp [Test]',
    log: loggers.test,
    serviceRegistryUrl: `http://${process.env.SVC_REGISTRY_HOST}:${process.env.SVC_REGISTRY_PORT}`,
    serviceVersionId: '1.0.0',
  },
};
