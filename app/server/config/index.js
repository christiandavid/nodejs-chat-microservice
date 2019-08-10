require('dotenv').config();
const bunyan = require('bunyan');

const loggers = {
  production: () => bunyan.createLogger({ name: 'production', level: 'info' }),
  development: () => bunyan.createLogger({ name: 'development', level: 'debug' }),
  test: () => bunyan.createLogger({ name: 'test', level: 'fatal' }),
};

module.exports = {
  production: {
    siteName: 'ChatApp',
    log: loggers.production,
  },
  development: {
    siteName: 'ChatApp [Development]',
    log: loggers.development,
  },
  test: {
    siteName: 'ChatApp [Test]',
    log: loggers.test,
  },
};
