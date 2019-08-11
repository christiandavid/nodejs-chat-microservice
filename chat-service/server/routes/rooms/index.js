const express = require('express');

const router = express.Router();

module.exports = (params) => {
  const { roomService } = params;

  router.get('/', async (req, res) => {
    const roomsList = await roomService.getAll();
    return res.send(roomsList);
  });

  router.get('/:roomName', async (req, res) => {
    const roomDetails = await roomService.getDetails(req.params.roomName);

    if (!roomDetails) {
      return res.status(404).send({ error: 'Not found' });
    }

    return res.send(roomDetails);
  });

  return router;
};
