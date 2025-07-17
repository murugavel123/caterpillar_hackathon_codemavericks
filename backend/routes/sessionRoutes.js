const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// ✅ Create session
router.post('/', async (req, res) => {
  try {
    // Confirm payload includes all fields
    console.log("Received session data:", req.body); 
    const session = new Session({
      date: req.body.date,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      instructor_id: req.body.instructor_id,
      operator_id: req.body.operator_id || null, // optional
      booked: req.body.booked ?? false,
      completed: req.body.completed ?? false,
    });

    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ✅ Get sessions (e.g., for booking list or instructor)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.instructor_id) {
      filter.instructor_id = req.query.instructor_id;
    }
    if (req.query.booked !== undefined) {
      filter.booked = req.query.booked === 'true';
    }
    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === 'true';
    }

    const sessions = await Session.find(filter);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PATCH: Update session (e.g., book or complete)
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Session.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Session not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
