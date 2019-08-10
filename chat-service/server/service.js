const express = require('express');
const helmet = require('helmet');
const createError = require('http-errors');
const routes = require('./routes');
const RoomService = require('./services/RoomService');

const service = express();

module.exports = (config) => {
  const log = config.log();

  // Add a request logging middleware in development mode
  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }
  service.use(helmet());

  service.get('/favicon.ico', (req, res) => res.sendStatus(204));
  service.get('/robots.txt', (req, res) => res.sendStatus(204));

  const roomService = new RoomService();

  service.use('/', routes({ roomService }));

  // catch 404 and forward to error handler
  service.use((req, res, next) => next(createError(404, 'File not found')));

  // eslint-disable-next-line no-unused-vars
  service.use((error, req, res, next) => {
    res.status(error.status || 500);
    // Log out the error to the console
    log.error(error);
    return res.json({
      error: {
        message: req.app.get('env') === 'development' ? error.message : {},
      },
    });
  });

  return service;
};
