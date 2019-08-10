const express = require('express');

const router = express.Router();

const userRoute = require('./users');
const roomsRoute = require('./rooms');
const chatRoute = require('./chat');

module.exports = (param) => {
  // Index page
  router.get('/', (req, res) => res.render('pages/index', { error: req.query.error }));

  router.use('/users', userRoute(param));
  router.use('/rooms', roomsRoute(param));
  router.use('/chat', chatRoute(param));

  return router;
};
