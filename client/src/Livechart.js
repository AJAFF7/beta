import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

const LiveChart = () => {
  const [memoryData, setMemoryData] = useState([]);
  const [totalMemory, setTotalMemory] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const colors = [
    '#C01C28', '#fe6a35', '#d568fb', '#544fc5', '#2ee0ca',
    '#6D5642', '#30FFA2', '#6D5642', '#0EE41D', '#E9AD0C'
  ];

  useEffect(() => {
    const fetchMemoryData = async () => {
      try {
        const response = await axios.get('/api/memory-usage');
        const data = response.data;

        const pods = data.pods || [];
        const versions = data.versions || [];

        // Combine pods and versions
        const combinedData = [
          ...pods.map(pod => ({ memory: pod.memory || 0, name: pod.name || 'Unknown Pod', version: pod.version || 'N/A' })),
          ...versions.map(ver => ({ memory: ver.memory || 0, name: ver.name || 'Unknown Version', version: ver.version || 'N/A' }))
        ];

        setMemoryData(combinedData);
        setTotalMemory(combinedData.reduce((acc, item) => acc + (item.memory || 0), 0));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemoryData(); // Initial fetch
    const interval = setInterval(fetchMemoryData, 200); // Auto-refresh every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Return nothing if there is no data
  if (memoryData.length === 0) {
    return null; // Do not render anything
  }

  const chartData = {
    labels: memoryData.map(item => `${item.name} - ${item.version}`), // Combine pod/deployment name and version
    datasets: [
      {
        label: 'Memory Usage (MB)',
        data: memoryData.map(item => item.memory),
        backgroundColor: colors.slice(0, memoryData.length),
        borderColor: 'silver',
        borderWidth: 0.5,
        barPercentage: 0.6,
        categoryPercentage: 1.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'none',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.raw} MB (${((context.raw / totalMemory) * 100).toFixed(1)}%)`;
          }
        }
      },
      datalabels: {
        display: false, // Hide percentage labels inside the bars
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false, // Disable auto skip to show all labels
          font: {
            size: 8, // Smaller font size for labels
          },
          maxRotation: 100, // Rotate labels if they overlap
          minRotation: 0, // Ensure labels don’t rotate too much
        }
      }
    }
  };

  return (
    <div style={{ width: '80%', height: '300px' }}> {/* Reduced height to 300px */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading data...</div>
      ) : (
        <Bar data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default LiveChart;

