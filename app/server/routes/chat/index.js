const express = require('express');

const router = express.Router();

module.exports = () => {
  router.get('/', async (req, res, next) => {
    try {
      return res.render('pages/chat');
    } catch (err) {
      return next(err);
    }
  });

  router.get('/:room', async (req, res, next) => {
    try {
      return res.render('pages/chat', {
        room: req.params.room,
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
