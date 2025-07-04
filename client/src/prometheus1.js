import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import Grafanaall from './Grafanaall.js'; // Import CleanMemory component        

const GrafanaDashboard1 = () => {
  const navigate = useNavigate(); // Hook for navigation

  // Function to navigate back to the previous page
  const goBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (

    



    <div style={{
      backgroundColor: 'transparent',
      padding: 0,
      margin: 0,
      height: '100vh', // Full viewport height
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    }}>

      
      
      <div  style={{
        position: 'absolute',
        top: '21px',
        left: '27px',
        background: 'transparent',
        border: 'none',
        fontSize: '40px',
        color: '#C3961D',
        cursor: 'pointer',
        zIndex: 10, // Ensure button is above the iframe
      }}> <Grafanaall /> </div>
      
{/* Back to Previous Page Button */}
      <p className="back" onClick={goBack} style={{
        position: 'relative',
        bottom: '10px',
        left: '20px',
        background: 'transparent',
        border: 'none',
        fontSize: '40px',
        color: '#C3961D',
        cursor: 'pointer',
        zIndex: 10, // Ensure button is above the iframe
      }}>
        ←

      </p>
      



      {/* Render CleanMemory component */}
      <div style={{
        position: 'absolute',
        bottom: '20px', // Position CleanMemory at the bottom
        right: '20px', // Align it to the right corner
        zIndex: 10, // Ensure it's above the iframe
      }}>

      </div>

      {/* Main Node Exporter Full Dashboard */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}>
        {/* Embed the dashboard using the provided URL */}
        <iframe
          src="http://localhost:3000/d/linux-stats/1-linux-stats-with-node-exporter?orgId=1&from=now-5m&to=now&timezone=browser&var-job=node-exporter&var-node=172.18.0.2:30600&var-network_interface=eth0&refresh=15s"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Grafana Linux Stats Dashboard"
          style={{
            background: 'transparent',
            position: 'absolute', // Full page position
            top: 0,
            left: 0,
            border: 'none',
          }}
        />
      </div>
    </div>
    

  );
};

export default GrafanaDashboard1;


//        <CleanMemory />
