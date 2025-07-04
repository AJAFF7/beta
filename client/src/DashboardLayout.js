import React from "react";
import GrafanaLinkButton from "./Grafana.js";
import Clock from "./clock.js";
import MemoryUsageChart from "./Chart.js";
import PodStatus from "./Podstatus.js";
import Buttons from "./buttons.js";
import { Logs } from "./log.js";
import DmsLog from "./dmslog.js";
import MongoLog from "./mongolog.js";
import NodexLog from "./nodexlog.js";
import GrafanaEmbed from "./GrafanaEmbed.js";
import GrafanaDashboard2 from "./prometheus2.js";

function DashboardLayout({ activeEmbed, toggleEmbed }) {
  return (
    <div className="home">
      <div className="container">
        <div className="sections-container">
          {/* Add buttons like in the Home page, if needed */}
          <div className="new-button-section">
            <GrafanaLinkButton />
            <Clock />
          </div>

          {/* Default dashboard view */}
          {activeEmbed === null && (
            <>
              <div className="grafana-dashboard-section">
                <GrafanaDashboard2 />
              </div>

              <div className="buttons-section">
                <Buttons />
              </div>

              <div className="podstatus-section">
                <PodStatus />
              </div>

              <div className="memory-usage-chart-section">
                <div className="logs-container">
                  <div className="log-item">
                    <Logs />
                  </div>
                  <div className="log-item">
                    <DmsLog />
                  </div>
                  <div className="log-item">
                    <MongoLog />
                  </div>
                  <div className="log-item">
                    <NodexLog />
                  </div>
                </div>
                <MemoryUsageChart />
              </div>

              <div className="embed-section">
                <GrafanaEmbed />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
