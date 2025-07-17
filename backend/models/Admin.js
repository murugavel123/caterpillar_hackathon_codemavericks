const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  admin_id: String,
  email: String,
  password: String,
});

module.exports = mongoose.model("Admin", adminSchema);
