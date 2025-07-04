import React, { useState } from 'react';
//import GrafanaEmbed from './prometheus.js';

function Refresh({ onClick }) {
  const [isRotating, setIsRotating] = useState(false);

  // Handle Click and Trigger Rotation
  const handleClick = () => {
    setIsRotating(true); // Start rotation
    onClick(); // Call parent function (e.g., refresh)

    // Reset animation after it completes (0.4s)
    setTimeout(() => setIsRotating(false), 400);
  };

  return (
    <div className="refresh">
      <button 
        onClick={handleClick} 
        className="refresh-button"  // Unique class name
        style={{ 
          marginTop: '1px',
          padding: '2px', 
          border: 'none', // No border
          backgroundColor: 'transparent', // Transparent background
          color: '#98DF9B', // Symbol color (change if needed)
          cursor: 'pointer', 
          fontSize: '34px', // Symbol size
          transition: 'transform 0.4s ease-in-out',
          transform: isRotating ? 'rotate(360deg)' : 'rotate(0deg)'
        }}
      >
        ↻
      </button>
      
       <h2 className="headr" style={{ textAlign: 'center', marginBottom: 30 }}>
        K8s Api Server Cluster Memory Usage
      </h2>
      
    </div>
  );
}

export default Refresh;


// <h2 className="headr" style={{ textAlign: 'center', marginBottom: 30 }}>
//        K8s Api Server Cluster Memory Usage
//      </h2>


// <GrafanaEmbed />
