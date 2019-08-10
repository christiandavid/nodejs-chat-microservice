const express = require('express');
const helmet = require('helmet');
const ServiceRegistry = require('./lib/ServiceRegistry');

const service = express();

module.exports = (config) => {
  const log = config.log();
  const serviceRegistry = new ServiceRegistry(config);

  // Add a request logging middleware in development mode
  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }

  service.use(helmet());

  service.get('/favicon.ico', (req, res) => res.sendStatus(204));

  service.get('/get/:serviceName/:serviceVersion', (req, res) => {
    const { serviceName, serviceVersion } = req.params;
    const findService = serviceRegistry.get(serviceName, serviceVersion);
    if (!findService) {
      return res.status(404).json({ result: 'Service not found' });
    }

    return res.json(findService);
  });

  service.put('/service/:serviceName/:serviceVersion/:servicePort', (req, res) => {
    const { serviceName, serviceVersion, servicePort } = req.params;
    const serviceip = req.connection.remoteAddress.includes('::') ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;
    const serviceKey = serviceRegistry
      .add(serviceName, serviceVersion, serviceip, servicePort);

    return res.json({ result: serviceKey });
  });

  service.delete('/service/:serviceName/:serviceVersion/:servicePort', (req, res) => {
    const { serviceName, serviceVersion, servicePort } = req.params;
    const serviceip = req.connection.remoteAddress.includes('::') ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;
    const serviceKey = serviceRegistry
      .remove(serviceName, serviceVersion, serviceip, servicePort);

    return res.json({ result: serviceKey });
  });

  // eslint-disable-next-line no-unused-vars
  service.use((error, req, res, next) => {
    res.status(error.status || 500);
    // Log out the error to the console
    log.error(error);
    return res.json({
      error: {
        message: error.message,
      },
    });
  });
  return service;
};
