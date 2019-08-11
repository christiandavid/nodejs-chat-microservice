const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = (params) => {
  const { user } = params;

  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const userAccount = await user.signin(username, password);
      if (!userAccount) {
        return done(null, false, { message: 'No reply' });
      }
      if (userAccount.user.error) {
        return done(null, false, { message: userAccount.user.error });
      }
      return done(null, userAccount.user);
    } catch (err) {
      return done(err);
    }
  }));

  // eslint-disable-next-line no-underscore-dangle
  passport.serializeUser((userAccount, done) => done(null, userAccount._id));

  passport.deserializeUser(async (id, done) => {
    try {
      const userAccount = await user.findById(id);
      if (!userAccount) {
        return done(null, false, { message: 'No reply' });
      }
      if (userAccount.user.error) {
        return done(null, false, { message: userAccount.user.error });
      }
      return done(null, userAccount.user);
    } catch (err) {
      return done(err);
    }
  });

  return {
    initialize: passport.initialize(),
    session: passport.session(),
    setUser: (req, res, next) => {
      res.locals.user = req.user;
      return next();
    },
  };
};
