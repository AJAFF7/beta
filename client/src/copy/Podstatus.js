import React, { useState, useEffect } from 'react';
import './App.css';

const PodStatus = () => {
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showServerDown, setShowServerDown] = useState(false); // Controls the "Server is Down" message

  useEffect(() => {
    const fetchPodStatus = async () => {
      try {
        console.log('Fetching pod status...');
        const response = await fetch('http://localhost:3537/pod-status');
        console.log('Response received:', response);

        if (!response.ok) {
          throw new Error('Failed to fetch pod status');
        }

        const data = await response.json();
        console.log('Fetched data:', data);

        if (data.status === 'success') {
          setStatusData(data.data);
          setError(null);
          setLoading(false);
          setShowServerDown(false); // Hide "Server is Down" message if data fetch is successful
        } else {
          throw new Error('Cluster is Down');
        }
      } catch (err) {
        console.error('Error:', err);
        setShowServerDown(true); // Show "Server is Down"
        setLoading(false); // Stop loading while showing the message

        // After 3 seconds, show loading spinner again
        setTimeout(() => {
          setShowServerDown(false);
          setLoading(true);
        }, 4000);
      }
    };

    // Fetch data every second
    const interval = setInterval(fetchPodStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatPodName = (podName) => {
    return podName.split('-')[0];
  };

  // Function to add animation delay to text using spans
  const addAnimationDelay = (text) => {
    const letters = text.split('');
    let html = '';
    letters.forEach((letter, index) => {
      html += `<span style="animation-delay: ${index * 0.1}s;">${letter}</span>`;
    });
    return html;
  };

  // Show "Server is Down" for 3 seconds, then return to loading spinner
  if (showServerDown) {
    return <div className="error centered">Server is Down</div>;
  }

  // Show the loading spinner
  if (loading) {
    return <div className="centered-loading"></div>;
  }

  return (
    <div className="Appi">
      <h2>Pod Status</h2>
      <div className="status-grid-wrapper">
        <div className="status-grid">
          {statusData.map((service) => (
            <div key={service.serviceName} className={`service-card ${service.status}`}>
              <div className="status-info">
                <div className="status-display">
                  <span className={`status-dot ${service.status}`}></span>
                  {service.status === 'running' && (
                    <p className="status-label running"> Running</p>
                  )}
                  {service.status === 'pending' && (
                    <p className="status-label pending"> Pending</p>
                  )}
                  {service.status === 'error-pod' && (
                    <p className="status-label crashloopbackoff"> CLBOff</p>
                  )}
                  {service.status === 'error' && (
                    <div className="error-pod">
                      <p className="status-label error">Error</p>
                      <p>{service.message}</p>
                    </div>
                  )}
                  <p
                    dangerouslySetInnerHTML={{
                      __html: addAnimationDelay(formatPodName(service.pods[0])),
                    }}
                    className="pod-name"
                  />
                  <p className="replica-count">
                    <span className="letter">R</span>
                    <span className="number">{service.replicas}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PodStatus;

