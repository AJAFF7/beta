import React, { useState, useEffect } from "react";
import axios from "axios";

const DmsLog = () => {
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Default message after clearing logs
  const defaultMessage = "Server running on port: 8282"; // \nDB Connected....

  // Fetch logs from the backend API every 21 seconds
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get("http://localhost:3538/dmslogs");
        setLogs(response.data);
        setLoading(false);
        setError(""); // Clear the error if fetch is successful
      } catch (err) {
        setError("Dms not Running"); // Error fetching logs.
        setLoading(false);
      }
    };

    // Fetch logs initially
    fetchLogs();

    // Set up the interval to fetch logs every second (1000 milliseconds)
    const fetchIntervalId = setInterval(fetchLogs, 1000);

    // Cleanup interval when the component unmounts
    return () => clearInterval(fetchIntervalId);
  }, []);

  // Function to clear logs by calling the backend API
  const clearLogs = async () => {
    try {
      await axios.get("http://localhost:3538/clearlogs");
      setLogs(""); // Clear logs
    } catch (err) {
      setError("Error clearing logs.");
    }
  };

  return (
    <div className="logs-section" style={{ position: "relative", marginLeft: "0px" }}>
      <span 
        onClick={clearLogs} 
        style={{
          position: "absolute", 
          top: "5px", // Set arrow 5px from top
          left: "50%", // Center the arrow horizontally
          transform: "translateX(-50%)", // Ensure the arrow is fully centered
          cursor: "pointer",
          zIndex: 10, // Ensure it's above other elements
        }} 
        className="clear-logs"
      >
        ↓ {/* Arrow pointing to the bottom */}
      </span>
      <div className="logs-box" style={{ maxHeight: "100px", overflowY: "auto" }}>
        {loading ? (
          <p>Loading logs...</p>
        ) : error ? (
          <>
            <p style={{ fontSize: "13px", color: "red", marginLeft: "90px"  }}>{error}</p>
            <div className="loading-spinner-log" style={{ marginLeft: "130px"  }}></div> {/* Add a spinner for error case */}
          </>
        ) : (
          <pre className="log-item" style={{ fontSize: "9px" }}>{logs ? logs : defaultMessage}</pre>
        )}
      </div>
    </div>
  );
};

export default DmsLog;

