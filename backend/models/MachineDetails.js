const mongoose = require("mongoose");

const machineDetailsSchema = new mongoose.Schema({
  timestamp: { type: Date },                      // ❌ removed required
  machine_id: { type: String, required: true },
  operator_id: { type: String, required: true },
  engine_hours: { type: Number, required: true },
  fuels_used: { type: Number, required: true },
  load_cycles: { type: Number, required: true },
  idling_time: { type: Number, required: true },
  seatbelt_status: { type: Boolean, required: true },
  safety_alert: { type: Boolean, required: true },
  proximity: { type: Number, required: true },
  object: { 
    type: String,
    enum: ["human", "non_living", "no_object"],
    required: true
  }
});

module.exports = mongoose.model("MachineDetails", machineDetailsSchema);
