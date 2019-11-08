const express = require('express');
const roomsRoute = require('./rooms');
const messagesRoute = require('./messages');

const router = express.Router();

module.exports = params => {
  router.use('/rooms', roomsRoute(params));
  router.use('/messages', messagesRoute(params));

  return router;
};
