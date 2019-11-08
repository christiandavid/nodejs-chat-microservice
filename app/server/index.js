const express = require('express');
const createError = require('http-errors');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const conf = require('./config');
const routes = require('./routes');
const User = require('./services/User');
const Chat = require('./services/Chat');
const Message = require('./services/Message');
const CircuitBreaker = require('./lib/CircuitBreaker');

const app = express();
const config = conf[app.get('env')];

const log = config.log();

const circuitBreaker = new CircuitBreaker(config);
const chat = new Chat(config, circuitBreaker);
const message = new Message(config, circuitBreaker);
const user = new User(config, circuitBreaker);

const auth = require('./lib/auth')({ user });

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
app.use(cookieParser());

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});
client.on('error', log.error);

if (app.get('env') === 'production') {
  app.set('trust proxy', 'loopback');
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      name: 'sessionId',
      proxy: true,
      cookie: { secure: true },
      resave: true,
      saveUninitialized: false,
      store: new RedisStore({ client }),
    })
  );
} else {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: false,
      store: new RedisStore({ client }),
    })
  );
}

app.use(auth.initialize);
app.use(auth.session);
app.use(auth.setUser);

app.use('/', routes({ chat, message, user }));

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
app.listen(process.env.PORT, function() {
  log.info(
    `Listening on port ${this.address().port} in ${app.get('env')} mode.`
  );
});

module.export = app;
