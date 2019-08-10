const express = require('express');
const url = require('url');

const router = express.Router();

module.exports = (param) => {
  router.get('/:room', async (req, res, next) => {
    const { chat } = param;
    try {
      const { port, path } = url.parse(await chat.getChatUrl());
      const socketUrl = `http://localhost:${port}${path}`;
      return res.render('pages/chat', {
        room: req.params.room,
        socketUrl,
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
