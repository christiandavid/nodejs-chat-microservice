/* eslint-disable class-methods-use-this */
const RoomModel = require('../models/RoomModel');

class RoomService {
  async getAll() {
    try {
      return await RoomModel.find({}, 'name -_id').exec();
    } catch (err) {
      return err;
    }
  }

  async getDetails(roomName) {
    try {
      return await RoomModel.findOne({ name: roomName }).exec();
    } catch (err) {
      return err;
    }
  }
}

module.exports = RoomService;
