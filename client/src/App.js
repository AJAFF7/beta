import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
//import Home1 from "./Home1";
import { useState } from "react";
// import { motion } from "framer-motion";
import GrafanaDashboard1 from "./prometheus1.js";
import GrafanaDashboard2 from "./prometheus2.js";
import Login from "./Login.js";
//import PodStatus from './Podstatus.js';

//import Grafana from './Grafana.js';
//
function App() {
  //window.localStorage.setItem("userID");
  // const [isDarkMode, setIsDarkMode] = useState(false);

  // const toggleDarkMode = () => {
  //   setIsDarkMode(!isDarkMode);
  // };

  // const [darkModeColor, setDarkModeColor] = useState("dark-mode-default");

  // const toggleDarkMode = () => {
  //   // Toggle only between "dark-mode-default" and "dark-mode-alt1"
  //   setDarkModeColor((prev) =>
  //     prev === "dark-mode-default" ? "dark-mode-alt1" : "dark-mode-default",
  //   );
  // };

  const [darkModeColor, setDarkModeColor] = useState("dark-mode-default");

  const toggleDarkMode = () => {
    setDarkModeColor((prev) => {
      if (prev === "dark-mode-default") return "dark-mode-alt1";
      if (prev === "dark-mode-alt1") return "dark-mode-alt2";
      return "dark-mode-default"; // for "dark-mode-alt2" and any fallback
    });
  };

  return (
    // <div className={`app-header ${isDarkMode ? 'on' : 'off'}`}>
    // <div className="switch" onClick={toggleDarkMode}>
    // <div className={`handle ${isDarkMode ? 'right' : 'left'}`} />
    // </div>
    // <div>

    <div className={`App ${darkModeColor}`}>
      <div className="switch" onClick={toggleDarkMode}>
        <div className={`handle ${darkModeColor}`} />
      </div>

      <div>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/grafanaDashboard1" element={<GrafanaDashboard1 />} />
            <Route path="/grafanaDashboard2" element={<GrafanaDashboard2 />} />
          {/* <Route path="/Podstatus" element={<PodStatus />} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
