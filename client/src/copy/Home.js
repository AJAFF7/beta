import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

import GrafanaLinkButton from "./Grafana.js";
// import Clock from "./clock.js"; // Removed: file not found
// import MemoryUsageChart from "./Chart.js";
// import PodStatus from "./Podstatus.js";
import Buttons from "./buttons.js";
// import { Logs } from "./log.js";
// import DmsLog from "./dmslog.js";
// import MongoLog from "./mongolog.js";
// import NodexLog from "./nodexlog.js";
// import GrafanaDashboard2 from "./prometheus2.js";
// import GrafanaEmbed from "./GrafanaEmbed.js";

import Embed1 from "./Embed1.js";
import Embed2 from "./Embed2.js";
import Embed3 from "./Embed3.js";
import Embed4 from "./Embed4.js";
import Embed5 from "./Embed5.js";
import Embed6 from "./Embed6.js";
import Embed7 from "./Embed7.js";
import Embed8 from "./Embed8.js";
import Embed9 from "./Embed9.js";
import Embed10 from "./Embed10.js";
import Embed11 from "./Embed11.js";
import Embed12 from "./Embed12.js";
import Embed13 from "./Embed13.js";

function Home() {
  // const navigate = useNavigate();
  // const location = useLocation();
  const [activeEmbed, setActiveEmbed] = useState(null);

  const toggleEmbed = (key) => {
    setActiveEmbed((prev) => (prev === key ? null : key));
  };

  return (
    <div className="home">
      <div className="container">
        <div className="sections-container">
          <div className="new-button-section">
            <GrafanaLinkButton />
            {/* <Clock /> */}

            {/* Logo Spinner Section */}
            <div className="logo-wrapper-section">
              {/* KEEP your logo spinner JSX here */}
            </div>
          </div>

          {/* Conditionally render embeds */}
          {activeEmbed === "embed1" && <div className="next-embed-section"><Embed1 /></div>}
          {activeEmbed === "embed2" && <div className="next-embed-section"><Embed2 /></div>}
          {activeEmbed === "embed3" && <div className="next-embed-section"><Embed3 /></div>}
          {activeEmbed === "embed4" && <div className="next-embed-section"><Embed4 /></div>}
          {activeEmbed === "embed5" && <div className="next-embed-section"><Embed5 /></div>}
          {activeEmbed === "embed6" && <div className="next-embed-section"><Embed6 /></div>}
          {activeEmbed === "embed7" && <div className="next-embed-section"><Embed7 /></div>}
          {activeEmbed === "embed8" && <div className="next-embed-section"><Embed8 /></div>}
          {activeEmbed === "embed9" && <div className="next-embed-section"><Embed9 /></div>}
          {activeEmbed === "embed10" && <div className="next-embed-section"><Embed10 /></div>}
          {activeEmbed === "embed11" && <div className="next-embed-section"><Embed11 /></div>}
          {activeEmbed === "embed12" && <div className="next-embed-section"><Embed12 /></div>}
          {activeEmbed === "embed13" && <div className="next-embed-section"><Embed13 /></div>}

          {/* Default dashboard view */}
          {activeEmbed === null && (
            <>
              {/* <div className="grafana-dashboard-section">
                <GrafanaDashboard2 />
              </div> */}

              <div className="buttons-section">
                <Buttons />
              </div>

              {/* <div className="podstatus-section">
                <PodStatus />
              </div> */}

              {/* <div className="memory-usage-chart-section">
                <div className="logs-container">
                  <div className="log-item"><Logs /></div>
                  <div className="log-item"><DmsLog /></div>
                  <div className="log-item"><MongoLog /></div>
                  <div className="log-item"><NodexLog /></div>
                </div>
                <MemoryUsageChart />
              </div>

              <div className="embed-section">
                <GrafanaEmbed />
              </div> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
