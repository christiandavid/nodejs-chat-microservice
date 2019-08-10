const mongoose = require('mongoose');

module.exports.connect = async (dsn) => mongoose.connect(dsn, {
  useCreateIndex: true, useNewUrlParser: true,
});
