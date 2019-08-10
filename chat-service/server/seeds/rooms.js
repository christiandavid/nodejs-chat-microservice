const RoomModel = require('../models/RoomModel');

function createDefaultRooms() {
  // Default data
  const defaultRooms = [
    {
      name: 'money',
    },
    {
      name: 'investments',
    },
    {
      name: 'commodity',
    },
    {
      name: 'inflation',
    },
    {
      name: 'devaluation',
    },
    {
      name: 'interests',
    },
  ];
  RoomModel.find({}, (err, rooms) => {
    if (err) return err;
    if (rooms.length === 0) {
      defaultRooms.forEach((item) => {
        const newRoom = new RoomModel();
        newRoom.name = item.name;
        newRoom.save((errSave, room) => {
          if (errSave) return errSave;
          return room;
        });
      });
    }
    return rooms;
  });
}

module.exports = createDefaultRooms;
