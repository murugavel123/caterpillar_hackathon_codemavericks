const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  timestamp: { type: Date },
  machine_id: { type: String },
  description: [{ type: String }],
  seen: { type: Boolean, default: false } 

});

module.exports = mongoose.model('Notification', notificationSchema);
