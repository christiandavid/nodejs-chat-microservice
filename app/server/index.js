const express = require('express');
const createError = require('http-errors');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const conf = require('./config');
const routes = require('./routes');

const app = express();
const config = conf[app.get('env')];

const log = config.log();

// Add a request logging
if (app.get('env') === 'development') {
  app.locals.pretty = true;
  app.use((req, res, next) => {
    log.debug(`${req.method}: ${req.url}`);
    return next();
  });
}
app.use(helmet());

// set the view engine to ejs
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.locals.title = config.siteName;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

app.use('/', routes());

app.use((req, res, next) => next(createError(404, 'File not found')));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  const status = err.status || 500;
  res.locals.status = status;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(status);
  return res.render('error');
});

// eslint-disable-next-line func-names
app.listen(process.env.PORT, function () {
  log.info(`Listening on port ${this.address().port} in ${app.get('env')} mode.`);
});

module.export = app;
