const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema({
  instructor_id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  field_of_expertise: { type: String, required: true }
});

module.exports = mongoose.model("Instructor", instructorSchema);
