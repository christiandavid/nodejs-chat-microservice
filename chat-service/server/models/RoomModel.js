const mongoose = require('mongoose');

const RoomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: { unique: true },
    minlength: 3,
  },
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);
