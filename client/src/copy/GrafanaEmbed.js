import React, { useState, useEffect } from 'react';
import './App.css';

const GrafanaEmbed = () => {
  const [time, setTime] = useState(Date.now());

  /// Update the time every 20 seconds
//  useEffect(() => {
//    const interval = setInterval(() => {
//      setTime(Date.now());  // Update the current time
//    }, 20000); // Update every 20 seconds

//    return () => clearInterval(interval);
//  }, []);

  // Function to generate iframe src URL dynamically based on the time
  const generateIframeSrc = (baseSrc, panelId) => {
    const from = time - 60000; // 1 minute before the current time
    const to = time;           // Current time
    return `${baseSrc}&from=${from}&to=${to}&refresh=20s&panelId=${panelId}`;
  };

  const grafanaUrl = generateIframeSrc(
    "http://localhost:3000/d/linux-stats/1-linux-stats-with-node-exporter?orgId=1&from=now-5m&to=now&timezone=browser&var-job=node-exporter&var-node=172.18.0.2:30600&var-network_interface=eth0&refresh=15s",
    9
  );

  return (
    <div>

      <iframe
        src={grafanaUrl}
        width="850"
        height="525"
        frameBorder="0"
        title="Grafana Solo Panel"
        style={{ borderRadius: '13px' }}
      ></iframe>
    </div>
  );
};

export default GrafanaEmbed;

