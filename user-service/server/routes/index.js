const express = require('express');
const usersRoute = require('./users');

const router = express.Router();

module.exports = (params) => {
  router.use('/users', usersRoute(params));

  return router;
};
