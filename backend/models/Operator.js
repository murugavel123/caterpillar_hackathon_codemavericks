const mongoose = require("mongoose");

const operatorSchema = new mongoose.Schema({
  operator_id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model("Operator", operatorSchema);
