import React, { useState, useEffect } from 'react';
import './App.css';

const GrafanaEmbed = () => {
  const [time, setTime] = useState(Date.now());
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
      setCountdown(50);
    }, 50000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdownInterval);
  }, []);

  const generateIframeSrc = (baseSrc, panelId) => {
    const from = time - 60000;
    const to = time;
    return `${baseSrc}&from=${from}&to=${to}&refresh=5s&panelId=${panelId}`;
  };

  const panelIframes = [
    { src: "http://localhost:3000/d-solo/linux-stats/1-linux-stats-with-node-exporter?orgId=1&timezone=browser&var-job=node-exporter&var-node=172.18.0.2:30600&var-network_interface=eth0", panelId: 158 },
    { src: "http://localhost:3000/d-solo/linux-stats/1-linux-stats-with-node-exporter?orgId=1&timezone=browser&var-job=node-exporter&var-node=172.18.0.2:30600&var-network_interface=eth0", panelId: 16 },
    { src: "http://localhost:3000/d-solo/linux-stats/1-linux-stats-with-node-exporter?orgId=1&timezone=browser&var-job=node-exporter&var-node=172.18.0.2:30600&var-network_interface=eth0", panelId: 20 },
    { src: "http://localhost:3000/d-solo/linux-stats/1-linux-stats-with-node-exporter?orgId=1&timezone=browser&var-job=node-exporter&var-node=172.18.0.2:30600&var-network_interface=eth0", panelId: 21 },
    { src: "http://localhost:3000/d-solo/linux-stats/1-linux-stats-with-node-exporter?orgId=1&timezone=browser&var-job=node-exporter&var-node=172.18.0.2:30600&var-network_interface=eth0", panelId: 155 },
    { src: "http://localhost:3000/d-solo/linux-stats/1-linux-stats-with-node-exporter?orgId=1&timezone=browser&var-job=node-exporter&var-node=172.18.0.2:30600&var-network_interface=eth0", panelId: 14 },
    { src: "http://localhost:3000/d-solo/linux-stats/1-linux-stats-with-node-exporter?orgId=1&timezone=browser&var-job=node-exporter&var-node=172.18.0.2:30600&var-network_interface=eth0", panelId: 329 },
    { src: "http://localhost:3000/d-solo/linux-stats/1-linux-stats-with-node-exporter?orgId=1&timezone=browser&var-job=node-exporter&var-node=172.18.0.2:30600&var-network_interface=eth0", panelId: 327 },
    { src: "http://localhost:3000/d-solo/linux-stats/1-linux-stats-with-node-exporter?orgId=1&timezone=browser&var-job=node-exporter&var-node=172.18.0.2:30600&var-network_interface=eth0", panelId: 321 },
    { src: "http://localhost:3000/d-solo/linux-stats/1-linux-stats-with-node-exporter?orgId=1&timezone=browser&var-job=node-exporter&var-node=172.18.0.2:30600&var-network_interface=eth0", panelId: 323 },
    { src: "http://localhost:3000/d-solo/linux-stats/1-linux-stats-with-node-exporter?orgId=1&timezone=browser&var-job=node-exporter&var-node=172.18.0.2:30600&var-network_interface=eth0", panelId: 85 },

    // Newly added panels, now using the same layout and size (150x150)
    { src: "http://localhost:3000/d-solo/linux-stats/1-linux-stats-with-node-exporter?orgId=1&timezone=browser&var-job=node-exporter&var-node=172.18.0.2:30600&var-network_interface=eth0", panelId: 18 },
 //   { src: "http://localhost:3000/d-solo/linux-stats/1-linux-stats-with-node-exporter?orgId=1&timezone=browser&var-job=node-exporter&var-node=172.18.0.2:30600&var-network_interface=eth0", panelId: 15 },
   /// { src: "http://localhost:3000/d-solo/linux-stats/1-linux-stats-with-node-exporter?orgId=1&timezone=browser&var-job=node-exporter&var-node=172.18.0.2:30600&var-network_interface=eth0", panelId: 75 },
  ///  { src: "http://localhost:3000/d-solo/linux-stats/1-linux-stats-with-node-exporter?orgId=1&timezone=browser&var-job=node-exporter&var-node=172.18.0.2:30600&var-network_interface=eth0", panelId: 14 },
  ];

  const iframeSize = { width: 150, height: 150 };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, 150px)',
        gap: '15px',
        justifyContent: 'center',
      }}
    >
      {panelIframes.map(({ src, panelId }, index) => (
        <iframe
          key={index}
          src={generateIframeSrc(src, panelId)}
          width={iframeSize.width}
          height={iframeSize.height}
          frameBorder="0"
          title={`Grafana Panel ${index + 1}`}
        ></iframe>
      ))}
    </div>
  );
};

export default GrafanaEmbed;

