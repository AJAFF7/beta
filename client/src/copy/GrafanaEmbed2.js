import React from 'react';
import './App.css';

const GrafanaEmbed2 = () => {
  // Use the new Grafana URL you provided
  const grafanaUrl = "http://localhost:3000/d/linux-stats/1-linux-stats-with-node-exporter?orgId=1&from=now-5m&to=now&timezone=browser&var-job=node-exporter&var-node=172.18.0.2:30600&var-network_interface=eth0&refresh=15s";

  return (
    <div>
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

export default GrafanaEmbed2;

