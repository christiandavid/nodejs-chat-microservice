/* eslint-disable no-console */
/* eslint-disable global-require */
let db = null;
let UserModel = null;

try {
  // eslint-disable-next-line import/no-unresolved
  db = require('../../server/lib/db');
} catch (err) {
  console.log('db ignored');
}

try {
  // eslint-disable-next-line import/no-unresolved
  UserModel = require('../../server/models/UserModel');
} catch (err) {
  console.log('UserModel ignored');
}

const config = require('../../config').test;

module.exports.UserModel = UserModel;
module.exports.config = config;

module.exports.validUser = {
  username: 'christian',
  password: 'qwe1234', // ;)
};

module.exports.before = async () => {
  if (db) {
    await db.connect(config.db.dsn);
  }
  if (UserModel) {
    return UserModel.deleteMany({});
  }
  return true;
};

module.exports.after = async () => {
  if (UserModel) {
    await UserModel.deleteMany({});
  }
};

// Local helper function that creates a user
module.exports.createUser = async (agent, user) => agent
  .post('/users/signup')
  .set('content-type', 'application/json')
  .send(user);

// Local helper function that logs a user in
module.exports.loginUser = async (agent, username, password) => agent
  .post('/users/signin')
  .set('content-type', 'application/json')
  .send({ username, password });
