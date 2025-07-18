const mongoose = require("mongoose");

const machineDetailsSchema = new mongoose.Schema({
  timestamp: { type: Date },
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
    required: true,
  },
});

const MachineDetails = mongoose.model("MachineDetails", machineDetailsSchema);

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/caterpillarDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log("Connected to DB");

  let records = [];
  let baseEngineHours = 1500;

  for (let i = 0; i < 500; i++) {
    const proximity = Math.floor(Math.random() * (1000 - 50 + 1)) + 50;
    const obj = ["human", "non_living", "no_object"][Math.floor(Math.random() * 3)];

    records.push({
      timestamp: new Date(Date.now() + i * 60000), // 1-minute interval
      machine_id: "M015",
      operator_id: "3",
      engine_hours: baseEngineHours + i * 0.2, // Gradually increasing
      fuels_used: Math.floor(Math.random() * (100 - 5 + 1)) + 5,
      load_cycles: Math.floor(Math.random() * (150 - 50 + 1)) + 50,
      idling_time: Math.floor(Math.random() * (500 - 30 + 1)) + 30,
      seatbelt_status: Math.random() < 0.5,
      safety_alert: proximity < 100 && obj === "human",
      proximity: proximity,
      object: obj
    });
  }

  await MachineDetails.insertMany(records);
  console.log("Inserted 500 records successfully.");
  mongoose.disconnect();
}).catch(err => {
  console.error("Connection error:", err);
});
