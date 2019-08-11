const express = require('express');
const bodyParser = require('body-parser');
const QueueProcessing = require('./services/QueueProcessing');

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

  service.use(bodyParser.urlencoded({ extended: true }));

  const queueProcessing = new QueueProcessing(config);

  service.get('/replyQueue', async (req, res) => {
    const user = 'Tester';
    // const message = 'asdasdasdasdads asdasdasd /STOCK=1234 /stock=aapl.us1 klasdjklajlksdlkjasd klasdlkjasd [jajaja] /stock=aapl.us2 klasdjklajlksdlkjasd klasdlkjasd [jejeje] asdasd/stock=aapl.us3 klasdjklajlksdlkjasd klasdlkjasd [jejeje] asdasdasdasdads asdasdasd /stock=aapl.us4';
    const message = 'asdasdasdasdads asdasdasd /STOCK=1234 /stock=aapl.us klasdjklajlksdlkjasd klasdlkjasd [jajaja] /stock=aapl.us2 klasdjklajlksdlkjasd klasdlkjasd [jejeje] asdasd/stock=aapl.us3 klasdjklajlksdlkjasd klasdlkjasd [jejeje] asdasdasdasdads asdasdasd /stock=aapl.us4';
    // const message = 'asdasdasdasdads asdasdasd /blabla=1234';

    queueProcessing.processQueue(message)
      .then((data) => {
        if (data) {
          switch (typeof data) {
            case 'string':
              // TODO: Send error message to RabbitMQ
              log.info('Error');
              break;
            case 'object':
              // TODO: Send Success to RabbitMQ
              log.info('Ok');
              break;
            case 'number':
              // TODO: Send Dont exist to RabbitMQ
              log.info('Dont Exist');
              break;
            default:
              break;
          }
        }
      });

    return res.json({ load: 'testing' });
  });

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
