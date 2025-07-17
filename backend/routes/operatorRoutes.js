
const express = require('express');
const router = express.Router();
const TaskScheduler = require('../models/TaskScheduler');
const MachineDetails = require('../models/MachineDetails');
const Notification = require('../models/Notification');
const multer = require('multer');
const path = require("path");


// Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("📁 Saving file to /uploads");
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `proof_${Date.now()}${ext}`;
    console.log("📝 Generated filename:", filename);
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// ✅ Upload route with debugging
router.post("/upload-proof/:task_id", upload.single("proof"), async (req, res) => {
  console.log("📥 Upload request received");
  console.log("🔍 Task ID param:", req.params.task_id);

  if (!req.file) {
    console.error("❌ No file found in request");
    return res.status(400).json({ message: "No file uploaded" });
  }

  console.log("✅ File received:", req.file.originalname);
  console.log("📂 Stored at:", req.file.path);

  try {
    const updatedTask = await TaskScheduler.findOneAndUpdate(
      { task_id: req.params.task_id },
      {
        proof: req.file.filename,
        actual_end_time: new Date(),
        task_status: true,
      },
      { new: true }
    );

    if (!updatedTask) {
      console.error("❌ No matching task found");
      return res.status(404).json({ message: "Task not found" });
    }

    console.log("✅ Task updated with proof");
    res.json({ message: "Proof uploaded successfully", task: updatedTask });
  } catch (err) {
    console.error("🔥 Upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const { operator_id } = req.query;
    if (!operator_id) return res.status(400).json({ error: "operator_id required" });

    const tasks = await TaskScheduler.find({
      operator_id,
      $or: [{ task_status: false }, { task_status: null }]  // Only fetch incomplete tasks
    });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/machine-details", async (req, res) => {
  try {
    const data = await MachineDetails.find().limit(500);

    for (const entry of data) {
      const violations = [];

      if (entry.proximity < 100 && entry.object === "human") {
        violations.push("⚠️ Human detected within unsafe proximity");
      }

      if (!entry.seatbelt_status) {
        violations.push("⚠️ Seatbelt is OFF");
      }

      if (violations.length > 0) {
        await Notification.create({
          timestamp: new Date(),
          machine_id: entry.machine_id,
          description: violations
        });
      }
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching machine details or saving notifications:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find() // ❌ remove { seen: false }
      .sort({ timestamp: -1 }); // ✅ sort by most recent first

    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post('/notifications/mark-seen', async (req, res) => {
  try {
    await Notification.updateMany({ seen: false }, { $set: { seen: true } });
    res.json({ message: 'Marked as seen' });
  } catch (err) {
    console.error("Error marking notifications seen:", err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
