const express = require('express');

const router = express.Router();

module.exports = (params) => {
  router.get('/', async (req, res, next) => {
    const { chat } = params;
    try {
      const rooms = await chat.getRooms();

      return res.render('pages/rooms', {
        rooms,
        error: req.query.error,
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
