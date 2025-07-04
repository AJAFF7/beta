import React, { useEffect, useState } from 'react';
import './App.css'; // Separate CSS for styling

const LiveBar = ({ isActive }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % 4); // Loop through 4 dots
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="live-bar-container">
      {[0, 1, 2, 3].map((index) => (
        <div 
          key={index} 
          className={`live-bar ${index === activeIndex ? (isActive ? 'active' : 'error') : ''}`} 
        ></div>
      ))}
    </div>
  );
};

export default LiveBar;

