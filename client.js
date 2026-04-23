const axios = require("axios");
const readline = require("readline");
const si = require("systeminformation");
const { spawn } = require("child_process");

process.on("uncaughtException", (err) => {
  console.log("CRASH:", err.message);
  pause();
});

async function getDeviceId() {
  const cpu = await si.cpu();
  const os = await si.osInfo();
  return cpu.brand + "-" + os.hostname;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function pause() {
  rl.question("\nPress ENTER to exit...", () => process.exit());
}

rl.question("Enter your key: ", async (key) => {
  try {
    const deviceId = await getDeviceId();

    const res = await axios.post("http://localhost:3000/check", {
      key,
      deviceId
    });

    if (res.data.success) {
      console.log("Access granted:", res.data.msg);

      // 🚀 Launch your macro
      spawn("C:\\Users\\Administrator\\Desktop\\ruinm\\win-unpacked\\2toned.exe", [], {
        detached: true,
        stdio: "ignore"
      }).unref();

    } else {
      console.log("Denied:", res.data.msg);
    }

  } catch (err) {
    console.log("ERROR:", err.message);
  }

  pause();
});