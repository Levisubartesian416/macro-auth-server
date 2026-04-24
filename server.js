const express = require("express");
const app = express();

app.use(express.json());

// 🔥 simple in-memory storage
let keys = {};

// 🔑 generate key
app.get("/gen", (req, res) => {
  const key = Math.random().toString(36).substring(2, 12).toUpperCase();

  keys[key] = { deviceId: null };

  res.json({ key });
});

// 🔐 check key
app.post("/check", (req, res) => {
  const { key, deviceId } = req.body;

  if (!keys[key]) {
    return res.json({ success: false, msg: "Invalid key" });
  }

  if (!keys[key].deviceId) {
    keys[key].deviceId = deviceId;
    return res.json({ success: true, msg: "Activated" });
  }

  if (keys[key].deviceId === deviceId) {
    return res.json({ success: true, msg: "Welcome back" });
  }

  return res.json({ success: false, msg: "Key already used" });
});

// test route
app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(3000, () => console.log("Server running"));
