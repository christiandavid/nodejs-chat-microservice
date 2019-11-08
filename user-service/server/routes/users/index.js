const express = require('express');

const router = express.Router();

module.exports = params => {
  const { userService } = params;

  router.post('/findById', async (req, res) => {
    try {
      const userId = req.body.userId.trim();

      const user = await userService.getUserById(userId);

      return res.send({ user });
    } catch (err) {
      return res.status(421).send({ error: err.message });
    }
  });

  router.post('/signin', async (req, res) => {
    try {
      const username = req.body.username.trim();
      const password = req.body.password.trim();

      const user = await userService.login(username, password);

      return res.send({ user });
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  });

  router.post('/signup', async (req, res) => {
    try {
      const username = req.body.username.trim();
      const password = req.body.password.trim();

      const newUser = await userService.create(username, password);

      return res.send({ singup: !newUser.error });
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  });

  return router;
};
