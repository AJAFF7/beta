import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import GrafanaLinkButton from "./Grafana.js";
import Clock from "./clock.js";
import MemoryUsageChart1 from "./Chart1.js";
import PodStatus from "./Podstatus.js";
import Buttons1 from "./buttons1.js";
import { Logs } from "./log.js";
import DmsLog from "./dmslog.js";
import MongoLog from "./mongolog.js";
import NodexLog from "./nodexlog.js";

import Embed2 from "./Embed2.js";
import Embed3 from "./Embed3.js";
import Embed4 from "./Embed4.js";
import Embed5 from "./Embed5.js";
import Embed6 from "./Embed6.js";
import Embed7 from "./Embed7.js";

// GrafanaEmbed and GrafanaDashboard2 intentionally excluded (as per your setup)

function Home1() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeEmbed, setActiveEmbed] = useState(null); // null | 'embed2' to 'embed7'

  const goToHomeToggle = () => {
    setActiveEmbed(null);
    if (location.pathname === "/home1") {
      navigate("/");
    } else {
      navigate("/home1");
    }
  };

  const toggleEmbed = (key) => {
    setActiveEmbed((prev) => (prev === key ? null : key));
  };

  return (
    <div className="home">
      <div className="container">
        <div className="sections-container">
          <div className="new-button-section">
            <GrafanaLinkButton />
            <Clock />

            {/* Circle 1 - toggle between / and /home1 */}
            <div className="rotating-circle1" onClick={goToHomeToggle} />

            {/* Circle 2-7 - open embeds */}
            <div className="rotating-circle2" onClick={() => toggleEmbed("embed2")} />
            <div className="rotating-circle3" onClick={() => toggleEmbed("embed3")} />
            <div className="rotating-circle4" onClick={() => toggleEmbed("embed4")} />
            <div className="rotating-circle5" onClick={() => toggleEmbed("embed5")} />
            <div className="rotating-circle6" onClick={() => toggleEmbed("embed6")} />
            <div className="rotating-circle7" onClick={() => toggleEmbed("embed7")} />
          </div>

          {/* Conditionally render embeds */}
          {activeEmbed === "embed2" && <div className="next-embed-section"><Embed2 /></div>}
          {activeEmbed === "embed3" && <div className="next-embed-section"><Embed3 /></div>}
          {activeEmbed === "embed4" && <div className="next-embed-section"><Embed4 /></div>}
          {activeEmbed === "embed5" && <div className="next-embed-section"><Embed5 /></div>}
          {activeEmbed === "embed6" && <div className="next-embed-section"><Embed6 /></div>}
          {activeEmbed === "embed7" && <div className="next-embed-section"><Embed7 /></div>}

          {/* Default content (if no embed shown) */}
          {activeEmbed === null && (
            <>
              <div className="buttons-section">
                <Buttons1 />
              </div>

              <div className="podstatus-section">
                <PodStatus />
              </div>

              <div className="memory-usage-chart-section">
                <div className="logs-container">
                  <div className="log-item"><Logs /></div>
                  <div className="log-item"><DmsLog /></div>
                  <div className="log-item"><MongoLog /></div>
                  <div className="log-item"><NodexLog /></div>
                </div>
                <MemoryUsageChart1 />
              </div>

              <div className="embed-section">
                {/* <GrafanaEmbed /> */}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home1;

