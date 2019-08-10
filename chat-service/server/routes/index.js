const express = require('express');
const roomsRoute = require('./rooms');

const router = express.Router();

module.exports = (params) => {
  router.use('/rooms', roomsRoute(params));

  return router;
};
