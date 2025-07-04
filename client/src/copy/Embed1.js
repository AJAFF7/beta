import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//import GrafanaLinkButton from "./Grafana.js";
import Clock from "./clock.js";
import MemoryUsageChart from "./Chart.js";
import PodStatus from "./Podstatus.js";
import Buttons from "./buttons.js";
import { Logs } from "./log.js";
import DmsLog from "./dmslog.js";
import MongoLog from "./mongolog.js";
import NodexLog from "./nodexlog.js";
import GrafanaEmbed from "./GrafanaEmbed.js";

//import GrafanaDashboard2 from "./prometheus2.js";

function Embed1() {
  const navigate = useNavigate();
  const [activeEmbed, setActiveEmbed] = useState(null);

  const toggleEmbed = (key) => {
    setActiveEmbed((prev) => (prev === key ? null : key));
  };

  const goToHome = () => {
    setActiveEmbed(null);
    navigate("/");
  };

  return (
    <div className="home">
      <div className="container">
        <div className="sections-container">

         

          {/* Default dashboard view */}
          {activeEmbed === null && (
            <>
              
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
              {/*  <GrafanaEmbed /> */}
              </div>
              
            </>
          )}
        </div>
      </div>
    </div>

  );
}

export default Embed1;
