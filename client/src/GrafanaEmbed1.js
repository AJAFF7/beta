import React, { useState, useEffect } from 'react';
import './App.css';

const GrafanaEmbed1 = () => {
  const [time, setTime] = useState(Date.now());

  // Function to generate iframe src URL dynamically based on the time
  const generateIframeSrc = (baseSrc) => {
    const from = time - 3600000; // 1 hour before the current time
    const to = time; // Current time
    return `${baseSrc}&from=${from}&to=${to}&refresh=20s`;
  };

  const grafanaUrl = generateIframeSrc(
    "http://localhost:3000/d/xfpJB9FGz/node-exporter-dashboard-en-20201010-starsl-cn?var-interval=2m&orgId=1&from=now-1h&to=now&timezone=browser&var-origin_prometheus=&var-job=node-exporter&var-hostname=$__all&var-node=172.18.0.2:30600&var-device=$__all&var-maxmount=%2Fetc%2Fhostname&var-show_hostname=cluster-0-control-plane&var-total=1"
  );

  return (
    <div className="grafana-container">
      <iframe
        src={grafanaUrl}
        width="850"
        height="525"
        frameBorder="0"
        title="Grafana Dashboard"
        style={{ borderRadius: '13px' }}
      ></iframe>
    </div>
  );
};

export default GrafanaEmbed1;

