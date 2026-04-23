
const fs = require("fs");

const DB = "keys.json";

function load() {
  return JSON.parse(fs.readFileSync(DB));
}
function save(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

function genKey() {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
}

const db = load();
const key = genKey();

db[key] = { deviceId: null };
save(db);

console.log("Generated key:", key);
