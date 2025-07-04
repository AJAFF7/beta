import React, { useState, useEffect } from "react";
import axios from "axios";

const ConnectedDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ipInput, setIpInput] = useState("");
  const [webviewUrl, setWebviewUrl] = useState("");

  const fetchDevices = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:3535/api/devices");
      setDevices(res.data);
    } catch (err) {
      console.error("Error fetching devices:", err);
      setError("Failed to fetch devices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 2000); // Refresh every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const openDeviceUI = () => {
    if (!ipInput.trim()) {
      alert("Please enter a valid IP address.");
      return;
    }
    let url = ipInput.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }
    setWebviewUrl(url);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Connected Devices on Local Network</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter device IP"
          value={ipInput}
          onChange={(e) => setIpInput(e.target.value)}
          style={{ padding: "10px", width: "200px", marginRight: "10px" }}
        />
        <button onClick={openDeviceUI} style={{ padding: "10px 20px" }}>
          Go
        </button>
      </div>

      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
      {devices.length === 0 && !loading && !error && <p>No devices found.</p>}

      {devices.length > 0 && (
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead style={{ backgroundColor: "#007BFF", color: "white" }}>
            <tr>
              <th>Device Name</th>
              <th>MAC Address</th>
              <th>IP Address</th>
              <th>Status</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody style={{ color: "#007BFF" }}>
            {devices.map((device) => (
              <tr key={device.id}>
                {/* Show device name or fallback to IP */}
                <td>{device.name && device.name !== "?" ? device.name : device.ip}</td>
                <td>{device.mac}</td>
                <td>{device.ip}</td>
                <td>Active</td>
                <td>-</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {webviewUrl && (
        <div
          className="w-full h-full bg-white rounded-xl overflow-hidden border shadow"
          style={{ marginTop: "30px" }}
        >
          <webview
            src={webviewUrl}
            style={{
              width: "1535px",
              height: "75vh",
              borderRadius: "12px",
              overflow: "hidden",
              marginLeft: "30px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ConnectedDevices;

