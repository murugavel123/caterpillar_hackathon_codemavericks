const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Operator = require("../models/Operator");
const Instructor = require("../models/Instructor");

exports.register = async (req, res) => {
  const { id, email, password, role, field_of_expertise } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    let user;
    switch (role) {
      case "Admin":
        user = new Admin({ admin_id: id, email, password: hashedPassword });
        break;
      case "Operator":
        user = new Operator({ operator_id: id, email, password: hashedPassword });
        break;
      case "Instructor":
        user = new Instructor({ instructor_id: id, email, password: hashedPassword, field_of_expertise });
        break;
    }

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { id, password, role } = req.body;
  let user;
  let userIdKey;

  switch (role) {
    case "Admin":
      user = await Admin.findOne({ admin_id: id });
      userIdKey = "admin_id";
      break;
    case "Operator":
      user = await Operator.findOne({ operator_id: id });
      userIdKey = "operator_id";
      break;
    case "Instructor":
      user = await Instructor.findOne({ instructor_id: id });
      userIdKey = "instructor_id";
      break;
  }

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

  // ✅ Add the corresponding ID in the response
  res.json({
    token,
    role,
    [userIdKey]: user[userIdKey]
  });
};

