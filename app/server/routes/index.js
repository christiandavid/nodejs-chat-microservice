const express = require('express');
const passport = require('passport');

const router = express.Router();

const userRoute = require('./users');
const roomsRoute = require('./rooms');
const chatRoute = require('./chat');

module.exports = (params) => {
  function redirectIfLoggedIn(req, res, next) {
    if (req.user) return res.redirect('/rooms');
    return next();
  }

  function redirectIfNotLoggedIn(req, res, next) {
    if (!req.user) return res.redirect('/');
    return next();
  }

  // Index page
  router.get('/', redirectIfLoggedIn, (req, res) => res.render('pages/index', { error: req.query.error, success: req.query.success }));
  router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/?error=true',
  }));

  router.use('/users', userRoute(params, redirectIfLoggedIn));
  router.use('/rooms', roomsRoute(params, redirectIfNotLoggedIn));
  router.use('/chat', chatRoute(params, redirectIfNotLoggedIn));

  return router;
};
