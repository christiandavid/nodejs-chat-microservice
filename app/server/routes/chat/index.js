const express = require('express');
const url = require('url');

const router = express.Router();

module.exports = (params) => {
  router.get('/:roomName', async (req, res, next) => {
    const { chat } = params;
    try {
      const { port, path } = url.parse(await chat.getChatUrl());
      const socketUrl = `http://localhost:${port}${path}`;

      const roomDetail = await chat.getRoomDetail(req.params.roomName);
      if (roomDetail === false) {
        return res.redirect('/rooms?error=true');
      }

      return res.render('pages/chat', {
        roomName: req.params.roomName,
        socketUrl,
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
