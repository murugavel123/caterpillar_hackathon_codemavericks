const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
app.use('/api/tasks', require('./routes/operatorRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/session', require('./routes/sessionRoutes'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log("Server running on port 5000")))
  .catch(err => console.error(err));
