const express = require('express');

const router = express.Router();

module.exports = () => {
  router.get('/', (req, res) => res.render('pages/rooms'));

  return router;
};
