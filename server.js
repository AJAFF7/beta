const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");
const cheerio = require("cheerio");
const dns = require("dns");
const request = require('request');
const fetch = require("node-fetch");
const winston = require("winston");

const Pauth_Model1 = require("./models/Auth");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const http = require("http");

const util = require("util");
const xml2js = require("xml2js"); // ✅ Required for parsing Nmap XML
const fs = require("fs");
//const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = 3535;

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.static(path.join(__dirname, "build")));
app.options("*", cors()); // Handle CORS preflight

//🔌 API route to scan local network devices

// app.get("/api/devices", (req, res) => {
//   const subnet = "192.168.0.0/24"; // or your correct subnet

//   exec(`nmap -PR -sn ${subnet} -oX -`, { timeout: 15000 }, (err, stdout) => {
//     if (err) {
//       console.error("❌ Nmap scan failed:", err);
//       return res
//         .status(500)
//         .json({ error: "Nmap scan failed", details: err.message });
//     }

//     xml2js.parseString(stdout, (parseErr, result) => {
//       if (parseErr) {
//         console.error("❌ Failed to parse Nmap XML:", parseErr);
//         return res.status(500).json({ error: "Failed to parse scan results" });
//       }

//       const hosts = result.nmaprun?.host || [];

//       // ✅ If no hosts found, return empty list (not error)
//       if (hosts.length === 0) {
//         console.warn("⚠️ No devices found in scan.");
//         return res.json([]); // <-- This prevents frontend error
//       }

//       const devices = hosts
//         .filter((host) => host.status?.[0]?.$.state === "up")
//         .map((host, index) => {
//           const addresses = host.address || [];
//           const ip =
//             addresses.find((a) => a.$.addrtype === "ipv4")?.$.addr || "?";
//           const mac =
//             addresses.find((a) => a.$.addrtype === "mac")?.$.addr || "?";
//           const hostname = host.hostnames?.[0]?.hostname?.[0]?.$.name || "?";

//           return {
//             id: index + 1,
//             ip,
//             mac,
//             name: hostname,
//           };
//         });

//       res.json(devices);
//     });
//   });
// });


//Personal1 Auth or login Api
app.post("/personal1-login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Pauth_Model1.findOne({ username });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  }
  const token = jwt.sign({ id: user._id }, "dms_secret");
  res.json({ token, userID: user._id });
});

app.get("/get-username/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;
    const user = await Pauth_Model1.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Assuming the username is stored in a field called 'username' in the user document
    const username = user.username;
    res.json({ username });
  } catch (error) {
    console.error("Error fetching username:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Personal1 Register
app.post("/personal1-regis", async (req, res) => {
  const { username, password } = req.body;
  const user = await Pauth_Model1.findOne({ username });
  if (user) {
    return res.status(400).json({ message: "Username already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new Pauth_Model1({ username, password: hashedPassword });
  await newUser.save();
  res.json({ message: "User registered successfully" });
});

app.post("/logout", (req, res) => {
  try {
    res.clearCookie("token").json({ message: "Logged out successfully" });
    console.log("Logged out successfully");
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.delete("/p1-auths/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid ObjectId format" });
    }

    const result = await Pauth_Model1.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/check-device", async (req, res) => {
  const { ip } = req.body;

  if (!ip || typeof ip !== "string") {
    return res.status(400).json({ error: "Invalid IP address." });
  }

  let baseUrl = ip.startsWith("http://") || ip.startsWith("https://") ? ip : `http://${ip}`;
  const possiblePaths = ["/", "/index.html", "/main.html", "/login.html"];

  for (const path of possiblePaths) {
    try {
      const fullUrl = `${baseUrl}${path}`;
      const response = await fetch(fullUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "text/html",
        },
        timeout: 3000,
      });

      if (response.ok && response.headers.get("content-type")?.includes("text/html")) {
        return res.json({ url: fullUrl });
      }
    } catch (err) {
      // continue trying next path
    }
  }

  return res.status(502).json({ error: "Device not reachable or no valid page found." });
});



// Logger setup with winston
const logFilePath = path.join(__dirname, "server.log");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: logFilePath }),
    new winston.transports.Console(),
  ],
});




// Sample route to generate a log
app.get("/", (req, res) => {
  logger.info("GET / hit at " + new Date().toISOString());
  res.send("Server is running and logging...");
});

// Log API
app.get("/api/logs", (req, res) => {
  fs.readFile(logFilePath, "utf8", (err, data) => {
    if (err) {
      logger.error("Failed to read logs: " + err.message);
      return res.status(500).json({ error: "Failed to read logs." });
    }
    res.json({ logs: data });
  });
});

// Example log for every 10 seconds (for demo)
setInterval(() => {
  logger.info("Heartbeat log at " + new Date().toISOString());
}, 10000);



mongoose
  .connect(
    "mongodb+srv://ajsengineer:mdb5550140@clients.dzqygjh.mongodb.net/?retryWrites=true&w=majority&appName=Clients",
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));


// mongoose
//   .connect(
//     "mongodb+srv://ajsengineer:mdb5550140@blogs.uhzsop3.mongodb.net/?retryWrites=true&w=majority&appName=Blogs",
//     {},
//   )
//   .then(() => console.log("DB Connected..."))
//   .catch((err) => {
//     console.log(err);
//   });


// Start the server
app.listen(port, () => {
  console.log(` Server running at: http://localhost:${port}`);
});
