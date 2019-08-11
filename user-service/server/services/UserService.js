/* eslint-disable class-methods-use-this */
const UserModel = require('../models/UserModel');

class UserService {
  async getUserById(id) {
    try {
      const user = await await UserModel.findById(id).exec();
      if (!user) {
        return false;
      }
      return {
        // eslint-disable-next-line no-underscore-dangle
        _id: user._id,
        username: user.username,
      };
    } catch (err) {
      return { error: err.message };
    }
  }

  async login(username, password) {
    try {
      const user = await UserModel.findOne({ username }).exec();
      if (!user) {
        throw new Error('Invalid username or password');
      }
      const passwordOK = await user.comparePassword(password);
      if (!passwordOK) {
        throw new Error('Invalid username or password');
      }
      return {
        // eslint-disable-next-line no-underscore-dangle
        _id: user._id,
        username: user.username,
      };
    } catch (err) {
      return { error: err.message };
    }
  }

  async create(username, password) {
    try {
      const user = new UserModel({
        username,
        password,
      });
      const savedUser = await user.save();

      if (savedUser) { return true; }
      throw new Error('Failed to save user for unknown reasons');
    } catch (err) {
      return { error: err.message };
    }
  }
}

module.exports = UserService;
