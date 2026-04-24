const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// 🔐 ENV VARIABLES
const MONGO_URI = process.env.MONGO_URI;
const ADMIN_KEY = process.env.ADMIN_KEY;

// 🔌 CONNECT TO MONGODB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("Mongo error:", err));

// 📦 SCHEMA
const KeySchema = new mongoose.Schema({
  key: String,
  deviceId: String
});

const Key = mongoose.model("Key", KeySchema);

// 🔑 GENERATE KEY (LOCKED)
app.get("/gen", async (req, res) => {
  const adminKey = req.query.key;

  // 🚨 BLOCK if wrong or missing
  if (adminKey !== ADMIN_KEY) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const key = Math.random().toString(36).substring(2, 12).toUpperCase();

    await Key.create({ key, deviceId: null });

    res.json({ key });

  } catch (err) {
    res.status(500).json({ error: "Failed to generate key" });
  }
});

// 🔐 CHECK KEY
app.post("/check", async (req, res) => {
  try {
    const { key, deviceId } = req.body;

    const found = await Key.findOne({ key });

    if (!found) {
      return res.json({ success: false, msg: "Invalid key" });
    }

    if (!found.deviceId) {
      found.deviceId = deviceId;
      await found.save();
      return res.json({ success: true, msg: "Activated" });
    }

    if (found.deviceId === deviceId) {
      return res.json({ success: true, msg: "Welcome back" });
    }

    return res.json({ success: false, msg: "Key already used" });

  } catch (err) {
    res.json({ success: false, msg: "Server error" });
  }
});

// 🌐 TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server running");
});

// 🚀 START SERVER
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
