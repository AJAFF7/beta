import React, { useState, useEffect } from "react";

const GrafanaDashboard2 = () => {
  const [time, setTime] = useState(Date.now());
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
      setCountdown(20);
    }, 20000);
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

  const baseSrc =
    "http://localhost:3000/d-solo/Kn5xm-gZk/prometheus-rabbitmq-exporter?orgId=1&timezone=browser&var-DS_PROMETHEUS=default";

  const newPanelSrc = `http://localhost:3000/d-solo/Wu4xkdEZk/rabbitmq-monitoring?orgId=1&from=${time - 60000}&to=${time}&timezone=browser&var-datasource=fed97mbz027swd&var-node=$__all&refresh=auto&panelId=5&__feature.dashboardSceneSolo`;

  const iframes = [
    { panelId: 62, width: 150, height: 50, title: "Panel 62" },
    { panelId: 63, width: 150, height: 50, title: "Panel 63" },
    { panelId: 41, width: 150, height: 50, title: "Panel 41" },
    { panelId: 37, width: 150, height: 50, title: "Panel 37" },
    { countdownPanel: true },
    { panelId: 38, width: 150, height: 50, title: "Panel 38" },
    { panelId: 40, width: 150, height: 50, title: "Panel 40" },
    { panelId: 67, width: 150, height: 50, title: "Panel 67" },
    {
      panelId: 5,
      width: 150,
      height: 50,
      title: "RabbitMQ Monitoring",
      baseSrc: newPanelSrc,
      isExternal: true,
    },
  ];

  return (
    <div className="grafana-dashboard-section p-4">
      <div className="iframe-container grid grid-cols-3 gap-2">
        {iframes.map((panel, index) =>
          panel.countdownPanel ? (
            <div
              key="countdown"
              style={{
                width: "30px",
                height: "30px",
                color: "red",
                fontSize: "18px",
                fontWeight: "bold",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 4px 6px #777777",
                marginLeft: "0px",
                marginTop: "10px",
              }}
            >
              {countdown}
            </div>
          ) : (
            <iframe
              key={panel.panelId}
              className="rounded-lg shadow-lg transition-opacity duration-500"
              style={{
                clipPath: "inset(0 round 12px)",
                border: "none",
              }}
              src={
                panel.isExternal
                  ? panel.baseSrc
                  : generateIframeSrc(panel.baseSrc || baseSrc, panel.panelId)
              }
              width={panel.width}
              height={panel.height}
              frameBorder="0"
              title={panel.title}
            />
          )
        )}
      </div>
    </div>
  );
};

export default GrafanaDashboard2;
