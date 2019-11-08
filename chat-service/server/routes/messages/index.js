const express = require('express');

const router = express.Router();

module.exports = params => {
  const { messageService } = params;

  router.get('/:roomName', async (req, res) => {
    const allMessages = await messageService.getLastRoomMessages(
      req.params.roomName
    );
    return res.send(allMessages);
  });

  router.post('/', async (req, res) => {
    try {
      const user = req.body.user.trim();
      const room = req.body.room.trim();
      const message = req.body.message.trim();

      await messageService.save(user, room, message);

      return res.send({ saved: true });
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  });

  return router;
};
