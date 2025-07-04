import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import GrafanaLinkButton from "./Grafana.js";
import Clock from "./clock.js";
import MemoryUsageChart from "./Chart.js";
import ConnectedDevices from "./Podstatus.js";
import Buttons from "./buttons.js";
import { Logs } from "./log.js";
import DmsLog from "./dmslog.js";
import MongoLog from "./mongolog.js";
import NodexLog from "./nodexlog.js";

import GrafanaDashboard2 from "./prometheus2.js";
import GrafanaEmbed from "./GrafanaEmbed.js";

//import Embed1 from "./Embed1.js";
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

function Embed1() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeEmbed, setActiveEmbed] = useState(null); // null | 'embed1' to 'embed7'

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

            <div className="logo-wrapper-section">
              <div className="logo-wrapper">
                <div
                  className={`spinner-ring ${activeEmbed === "embed1" ? "active" : ""}`}
                >
                  <div className="logo-center">
                    <img
                      className="logo home1-logo"
                      src="/home1.png"
                      alt="Home"
                      onClick={() => toggleEmbed("embed1")}
                    />
                  </div>
                </div>
              </div>
              <div className="logo-wrapper">
                <div
                  className={`spinner-ring ${activeEmbed === "embed2" ? "active" : ""}`}
                >
                  <div className="logo-center">
                    <img
                      className="logo jenkins-logo"
                      src="/jenkins.png"
                      alt="Jenkins"
                      onClick={() => toggleEmbed("embed2")}
                    />
                  </div>
                </div>
              </div>
              <div className="logo-wrapper">
                <div
                  className={`spinner-ring ${activeEmbed === "embed3" ? "active" : ""}`}
                >
                  <div className="logo-center">
                    <img
                      className="logo ansible-logo"
                      src="/ansible.png"
                      alt="Ansible"
                      onClick={() => toggleEmbed("embed3")}
                    />
                  </div>
                </div>
              </div>
              <div className="logo-wrapper">
                <div
                  className={`spinner-ring ${activeEmbed === "embed4" ? "active" : ""}`}
                >
                  <div className="logo-center">
                    <img
                      className="logo docker-logo"
                      src="/docker.png"
                      alt="Docker"
                      onClick={() => toggleEmbed("embed4")}
                    />
                  </div>
                </div>
              </div>
              <div className="logo-wrapper">
                <div
                  className={`spinner-ring ${activeEmbed === "embed5" ? "active" : ""}`}
                >
                  <div className="logo-center">
                    <img
                      className="logo github-logo"
                      src="/github.png"
                      alt="Github"
                      onClick={() => toggleEmbed("embed5")}
                    />
                  </div>
                </div>
              </div>
              <div className="logo-wrapper">
                <div
                  className={`spinner-ring ${activeEmbed === "embed6" ? "active" : ""}`}
                >
                  <div className="logo-center">
                    <img
                      className="logo simplenote-logo"
                      src="/simplenote.png"
                      alt="Simplenote"
                      onClick={() => toggleEmbed("embed6")}
                    />
                  </div>
                </div>
              </div>
              <div className="logo-wrapper">
                <div
                  className={`spinner-ring ${activeEmbed === "embed7" ? "active" : ""}`}
                >
                  <div className="logo-center">
                    <img
                      className="logo octant-logo"
                      src="/octant.png"
                      alt="Octant"
                      onClick={() => toggleEmbed("embed7")}
                    />
                  </div>
                </div>
              </div>
              <div className="logo-wrapper">
                <div
                  className={`spinner-ring ${activeEmbed === "embed8" ? "active" : ""}`}
                >
                  <div className="logo-center">
                    <img
                      className="logo crm-logo"
                      src="/crm.png"
                      alt="Crm"
                      onClick={() => toggleEmbed("embed8")}
                    />
                  </div>
                </div>
              </div>
              <div className="logo-wrapper">
                <div
                  className={`spinner-ring ${activeEmbed === "embed9" ? "active" : ""}`}
                >
                  <div className="logo-center">
                    <img
                      className="logo cf-logo"
                      src="/cf.png"
                      alt="Cf"
                      onClick={() => toggleEmbed("embed9")}
                    />
                  </div>
                </div>
              </div>
              <div className="logo-wrapper">
                <div
                  className={`spinner-ring ${activeEmbed === "embed10" ? "active" : ""}`}
                >
                  <div className="logo-center">
                    <img
                      className="logo argocd-logo"
                      src="/argocd.png"
                      alt="ArgoCD"
                      onClick={() => toggleEmbed("embed10")}
                    />
                  </div>
                </div>
              </div>
              <div className="logo-wrapper">
                <div
                  className={`spinner-ring ${activeEmbed === "embed11" ? "active" : ""}`}
                >
                  <div className="logo-center">
                    <img
                      className="logo argor-logo"
                      src="/argor.png"
                      alt="ArgoR"
                      onClick={() => toggleEmbed("embed11")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conditionally render embeds */}
          {activeEmbed === "embed1" && (
            <div className="next-embed-section">
              <Embed1 />
            </div>
          )}
          {activeEmbed === "embed2" && (
            <div className="next-embed-section">
              <Embed2 />
            </div>
          )}
          {activeEmbed === "embed3" && (
            <div className="next-embed-section">
              <Embed3 />
            </div>
          )}
          {activeEmbed === "embed4" && (
            <div className="next-embed-section">
              <Embed4 />
            </div>
          )}
          {activeEmbed === "embed5" && (
            <div className="next-embed-section">
              <Embed5 />
            </div>
          )}
          {activeEmbed === "embed6" && (
            <div className="next-embed-section">
              <Embed6 />
            </div>
          )}
          {activeEmbed === "embed7" && (
            <div className="next-embed-section">
              <Embed7 />
            </div>
          )}
          {activeEmbed === "embed8" && (
            <div className="next-embed-section">
              <Embed8 />
            </div>
          )}
          {activeEmbed === "embed9" && (
            <div className="next-embed-section">
              <Embed9 />
            </div>
          )}
          {activeEmbed === "embed10" && (
            <div className="next-embed-section">
              <Embed10 />
            </div>
          )}
          {activeEmbed === "embed11" && (
            <div className="next-embed-section">
              <Embed11 />
            </div>
          )}

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
                <ConnectedDevices />
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

export default Embed1;
