import React, { useEffect, useState, useRef } from 'react';
import './App.css';

// Function to fetch and clean logs
export const fetchLogs = async () => {
  try {
    const response = await fetch('http://localhost:3535/logs');
    const data = await response.json();

    console.log("Fetched logs:", data); // Debugging line to check fetched logs

    // Check if logs are present in the response
    if (!data.logs) {
      console.error('No logs found in the response');
      return []; // Return an empty array if no logs are found
    }

    // Clean logs and return them
    const cleanedLogs = data.logs
      .split("\n") // Split logs into an array of individual log entries
      .map(log => log.replace(/^\S+ \S+ - /, '')) // Remove date/time from each log entry
      .filter(log => log.trim() !== ''); // Filter out empty log entries

    // Ensure the necessary logs exist
    const requiredLogs = ["Server is running on port 3535", "kubectl proxy 8001"];
    const foundLogs = cleanedLogs.filter(log => 
      requiredLogs.some(reqLog => log.includes(reqLog))
    );

    if (foundLogs.length === 0) {
      console.warn("Required logs not found:", requiredLogs);
    }

    return cleanedLogs; // Return cleaned logs
  } catch (error) {
    console.error('Error fetching logs:', error);
    return []; // Return empty array in case of error
  }
};

// Function to clear logs
export const clearLogs = async () => {
  try {
    const response = await fetch('http://localhost:3535/clear-logs', {
      method: 'POST', // Assuming you want to clear logs with a POST request
    });

    if (response.ok) {
      console.log('Logs cleared successfully');
      return true; // Return success status
    } else {
      console.error('Failed to clear logs');
      return false; // Return failure status
    }
  } catch (error) {
    console.error('Error clearing logs:', error);
    return false; // Return failure status
  }
};

// The Logs component itself
export const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [dotCount, setDotCount] = useState(1); // To control the number of dots (1 to 4)
  const logsContainerRef = useRef(null); // Create a reference to the logs container

  // Fetch logs when the component is mounted
  useEffect(() => {
    const loadLogs = async () => {
      const logsData = await fetchLogs();
      console.log("Loaded logs:", logsData); // Debugging line to check loaded logs

      setLogs(logsData); // Set logs (even if empty)
    };

    loadLogs(); // Load logs initially

    // Set an interval to refresh the waiting message with dots every 1 second (1000ms)
    const interval = setInterval(() => {
      setDotCount((prevCount) => (prevCount % 4) + 1); // Increment dot count (cycling from 1 to 4)
      loadLogs(); // Load logs every second
    }, 1000); // Interval set to 1 second

    // Cleanup interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  // Scroll to the bottom when logs change
  useEffect(() => {
    const scrollToBottom = () => {
      if (logsContainerRef.current) {
        const container = logsContainerRef.current;
        container.scrollTop = container.scrollHeight;  // Scroll to the bottom
      }
    };

    // Ensure scrolling happens after DOM updates
    const timeoutId = setTimeout(scrollToBottom, 100);

    return () => clearTimeout(timeoutId);
  }, [logs]); // Runs whenever logs change

  // Generate the "Waiting for logs..." message with 1 to 4 dots
  const generateWaitingMessage = () => {
    return `Waiting for logs${'.'.repeat(dotCount)}`; // Add 1 to 4 dots based on dotCount
  };

  // Handle clear logs button click
  const handleClearLogs = async () => {
    const success = await clearLogs();
    if (success) {
      setLogs([]); // Clear logs in the UI
    } else {
      alert('Failed to clear logs');
    }
  };

  return (
    <div className="logs-section" style={{ position: 'relative' }}>
      {/* Clear Logs Button positioned at the top center */}
      <span 
        onClick={handleClearLogs} 
        className="clear-logs"
        style={{
          position: "absolute", 
          top: "5px", 
          left: "50%", 
          transform: "translateX(-50%)", 
          cursor: "pointer"
        }}
      >
        ↓
      </span>
      <div className="logs-box" ref={logsContainerRef} style={{ maxHeight: '100px', overflowY: 'auto' }}>
        <pre>
          {logs.length === 0 ? (
            <div>{generateWaitingMessage()}</div> // Show "Waiting for logs..." only when no logs are available
          ) : (
            logs.map((log, index) => (
              <div key={index} className="log-item">{log}</div> // Display each log entry
            ))
          )}
        </pre>
      </div>
    </div>
  );
};

