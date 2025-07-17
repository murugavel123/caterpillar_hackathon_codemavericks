const express = require("express");
const router = express.Router();  // ✅ define router here
const TaskScheduler = require("../models/TaskScheduler");



router.get("/completed-tasks", async (req, res) => {
  try {
    const completedTasks = await TaskScheduler.find(
      { task_status: true },
      {
        _id: 0,
        task_id: 1,
        operator_id: 1,
        machine_id: 1,
        actual_start_time: 1,
        actual_end_time: 1,
        proof: 1
      }
    );
    res.json(completedTasks);
  } catch (err) {
    console.error("Error fetching completed tasks:", err);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/operator-tasks", async (req, res) => {
  try {
    console.log("📥 API hit: /api/operator-tasks");

    const tasks = await TaskScheduler.find(
        {
            $or: [
            { actual_end_time: null },
            { actual_end_time: { $exists: false } },
            { actual_end_time: "" }
            ]
        },
        {
            _id: 0,
            operator_id: 1,
            task_id: 1,
            task_name: 1,
            scheduled_start_time: 1,
            scheduled_end_time: 1,
            task_location: 1
        }
        );


    console.log("🧪 Found tasks:", tasks);

    if (tasks.length === 0) {
      return res.status(404).json({ message: "Every task has been completed." });
    }

    return res.status(200).json(tasks);
  } catch (err) {
    console.error("❌ ERROR in /operator-tasks:", err);
    return res.status(500).json({ message: "Server error" });
  }
});




// Add a new task
router.post('/add', async (req, res) => {
  try {
    const {
      task_id,
      operator_id,
      admin_id,
      task_name,
      machine_id,
      scheduled_start_time,
      scheduled_end_time,
      task_location
    } = req.body;

    const newTask = new TaskScheduler({
      task_id,
      operator_id,
      admin_id,
      task_name,
      machine_id,
      scheduled_start_time,
      scheduled_end_time,
      task_location,
      actual_start_time: null,
      actual_end_time: null,
      task_status: null,
      proof: null
    });

    await newTask.save();
    res.status(201).json({ message: "Task Assigned Successfully", task: newTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
