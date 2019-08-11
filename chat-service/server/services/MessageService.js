/* eslint-disable class-methods-use-this */
const MessageModel = require('../models/MessageModel');

class RoomService {
  async getLastRoomMessages(room, limit = 50) {
    try {
      const messages = await MessageModel.find({ room }, 'user message -_id').sort({ createdAt: -1 }).limit(limit).exec();
      return messages ? messages.reverse() : messages;
    } catch (err) {
      return err;
    }
  }

  async save(user, room, message) {
    try {
      const newMessage = new MessageModel({
        user,
        room,
        message,
      });
      const savedMessage = await newMessage.save();
      if (savedMessage) { return savedMessage; }

      throw new Error('The message could not be stored');
    } catch (err) {
      return err;
    }
  }
}

module.exports = RoomService;
