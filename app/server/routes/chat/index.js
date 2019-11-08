const express = require('express');
const { URL } = require('url');

const router = express.Router();

module.exports = (params, redirectIfNotLoggedIn) => {
  router.get('/:roomName', redirectIfNotLoggedIn, async (req, res, next) => {
    const { chat, message } = params;
    const { roomName } = req.params;
    try {
      const roomDetail = await chat.getRoomDetail(roomName);
      if (roomDetail === false) {
        return res.redirect('/rooms?error=true');
      }

      const { port, pathname } = new URL(await chat.getChatUrl());
      const socketUrl = `http://localhost:${port}${pathname}`;

      const roomMessages = await message.getLastRoomMessages(roomName);

      return res.render('pages/chat', {
        roomName,
        socketUrl,
        roomMessages,
        // eslint-disable-next-line no-underscore-dangle
        usrId: req.user._id,
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
