
const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const DB = "keys.json";

function load() {
  return JSON.parse(fs.readFileSync(DB));
}
function save(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

// check key + bind device
app.post("/check", (req, res) => {
  const { key, deviceId } = req.body;
  const db = load();

  if (!db[key]) return res.json({ success: false, msg: "Invalid key" });

  if (!db[key].deviceId) {
    db[key].deviceId = deviceId; // bind first use
    save(db);
    return res.json({ success: true, msg: "Activated on this device" });
  }

  if (db[key].deviceId === deviceId) {
    return res.json({ success: true, msg: "Welcome back" });
  }

  return res.json({ success: false, msg: "Key already used on another device" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
