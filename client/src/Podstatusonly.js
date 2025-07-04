import React, { useState, useEffect } from 'react';
import './App.css';

const PodStatusonly = () => {
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPodStatus = async () => {
      try {
        const response = await fetch('http://localhost:3535/pod-status');
        const data = await response.json();

        if (data.status === 'success') {
          setStatusData(data.data);
          setError(null); // Reset error on successful fetch
        } else {
          setError('Failed to fetch pod statuses');
        }
      } catch (err) {
        setError('Error fetching data from server');
      } finally {
        setLoading(false);
      }
    };

    // Fetch data every second
    const interval = setInterval(async () => {
      await fetchPodStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatPodName = (podName) => {
    const parts = podName.split('-');
    return parts[0]; // Get only the first part of the pod name
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="od-status-container">
      <div className="status-grid-wrapper-s">
        <div className="status-grid-s">
          {statusData.map((service) => (
            <div key={service.serviceName} className={`service-card-s ${service.status}`}>
              <div className="status-info-s">
                {/* Removed all status text (Running, Pending, etc.) */}
                <div className="status-display">
                  <span className={`status-dot ${service.status}`}></span>
                  {service.status === 'running' && (
                    <p className="status-label-s running">
                      {formatPodName(service.pods[0])}
                    </p>
                  )}
                  {service.status === 'pending' && (
                    <p className="status-label-s pending">
                      {formatPodName(service.pods[0])}
                    </p>
                  )}
                  {service.status === 'error-pod' && (
                    <p className="status-label-s error">
                      {formatPodName(service.pods[0])}
                    </p>
                  )}
                  {service.status === 'error' && (
                    <div className="error-pod-s">
                      <p className="status-label-s error">
                        {formatPodName(service.pods[0])}
                      </p>
                      <p>{service.message}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PodStatusonly;

