const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");
const cheerio = require("cheerio");
const dns = require("dns");

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

app.get("/api/devices", (req, res) => {
  const subnet = "192.168.0.0/24"; // or your correct subnet

  exec(`nmap -PR -sn ${subnet} -oX -`, { timeout: 15000 }, (err, stdout) => {
    if (err) {
      console.error("❌ Nmap scan failed:", err);
      return res
        .status(500)
        .json({ error: "Nmap scan failed", details: err.message });
    }

    xml2js.parseString(stdout, (parseErr, result) => {
      if (parseErr) {
        console.error("❌ Failed to parse Nmap XML:", parseErr);
        return res.status(500).json({ error: "Failed to parse scan results" });
      }

      const hosts = result.nmaprun?.host || [];

      // ✅ If no hosts found, return empty list (not error)
      if (hosts.length === 0) {
        console.warn("⚠️ No devices found in scan.");
        return res.json([]); // <-- This prevents frontend error
      }

      const devices = hosts
        .filter((host) => host.status?.[0]?.$.state === "up")
        .map((host, index) => {
          const addresses = host.address || [];
          const ip =
            addresses.find((a) => a.$.addrtype === "ipv4")?.$.addr || "?";
          const mac =
            addresses.find((a) => a.$.addrtype === "mac")?.$.addr || "?";
          const hostname = host.hostnames?.[0]?.hostname?.[0]?.$.name || "?";

          return {
            id: index + 1,
            ip,
            mac,
            name: hostname,
          };
        });

      res.json(devices);
    });
  });
});

// 🚀 Start the server
app.listen(port, () => {
  console.log(`✅ Server running at: http://localhost:${port}`);
});
