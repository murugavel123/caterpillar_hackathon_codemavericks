const mongoose = require("mongoose");

const taskSchedulerSchema = new mongoose.Schema({
  task_id: { type: String, required: true, unique: true },
  operator_id: { type: String, required: true },
  admin_id: { type: String, required: true },
  task_name: { type: String, required: true },
  machine_id: { type: String, required: true },
  task_location: { type: String, required: true },
  scheduled_start_time: { type: Date, required: true },
  scheduled_end_time: { type: Date, required: true },
  actual_start_time: { type: Date },
  actual_end_time: { type: Date },
  task_status: { type: Boolean, default: false },
  proof: { type: String }
});

module.exports = mongoose.model("TaskScheduler", taskSchedulerSchema, "task_schedulers");

