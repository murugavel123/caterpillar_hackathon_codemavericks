const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const Operator = require('../models/Operator');
router.post("/signup", register);
router.post("/login", login);
router.get('/operators', async (req, res) => {
  try {
    const operators = await Operator.find({}, 'operator_id email'); // only return needed fields
    res.json(operators);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
