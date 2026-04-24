const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// 🔌 connect to Mongo
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("Mongo error:", err));

// 📦 schema
const KeySchema = new mongoose.Schema({
  key: String,
  deviceId: String
});

const Key = mongoose.model("Key", KeySchema);

// 🔑 generate key
app.get("/gen", async (req, res) => {
  try {
    const key = Math.random().toString(36).substring(2, 12).toUpperCase();

    await Key.create({ key, deviceId: null });

    res.json({ key });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to generate key" });
  }
});

// 🔐 check key
app.post("/check", async (req, res) => {
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
});

// test
app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(3000, () => {
  console.log("Server running");
});
