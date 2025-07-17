const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  instructor_id: { type: String },         // ❌ removed required
  operator_id: { type: String },           // ❌ removed required
  completed: { type: Boolean, default: false },  // ❌ no required needed
  booked: { type: Boolean, default: false }      // ❌ no required needed
});

module.exports = mongoose.model("Session", sessionSchema);
