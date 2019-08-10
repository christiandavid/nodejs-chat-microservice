const express = require('express');

const router = express.Router();

module.exports = () => {
  router.get('/logout', (req, res) => res.redirect('/'));

  router.get('/signup', (req, res) => res.render('pages/signup', { success: req.query.success }));

  router.post('/signup',
    async (req, res, next) => {
      try {
        // Not yet implemented
        return res.redirect('/?success=true');
      } catch (err) {
        return next(err);
      }
    });

  return router;
};
