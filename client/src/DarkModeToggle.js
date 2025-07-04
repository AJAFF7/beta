import React, { useState } from "react";
import "./App.css";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState("dark-mode-default");

  const toggleDarkMode = () => {
    setDarkMode((prev) =>
      prev === "dark-mode-default" ? "dark-mode-alt1" : "dark-mode-default"
    );
  };

  return (
    <div className="toggle-container" onClick={toggleDarkMode}>
      <div className={`toggle-button ${darkMode === "dark-mode-alt1" ? "alt-active" : ""}`}>
        <div className="toggle-handle" />
        <span className="toggle-label default-label">Dark Mode</span>
        <span className="toggle-label alt-label">Alt Mode</span>
      </div>
      <span className="mode-subtext">
        {darkMode === "dark-mode-alt1" ? "Activated" : ""}
      </span>
    </div>
  );
};

export default DarkModeToggle;

