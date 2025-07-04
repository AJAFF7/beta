import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import LiveBar from './Livebar';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const MemoryUsageChart = () => {
  const [memoryData, setMemoryData] = useState({ pods: [], versions: [] });
  const [totalMemory, setTotalMemory] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiError, setIsApiError] = useState(false);

  const colors = [
  
  
  // 'rgba(255, 255, 220, 1)', '#fe6a35', '#d568fb', '#544fc5', '#2ee0ca',
  // '#6D5642', '#30FFA2', '#6D5642', '#0EE41D', '#E9AD0C'
   
   '#FF5733', '#33A1FF', '#8D33FF', '#33FFBD', '#FF33EC',
   '#FFC300', '#FF5733', '#DAF7A6', '#C70039', '#581845'
  
  // '#FF5733', '#33A1FF', '#8D33FF', '#33FFBD', '#FF33EC',
  // '#7678ED', '#6A4C93', '#FFCA3A', '#CDB4DB', '#BDEOFE'
 
  ];


  useEffect(() => {
    const fetchMemoryData = async () => {
      try {
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout exceeded')), 1000)
        );

        const response = await Promise.race([
          axios.get('http://localhost:3536/api/memory-usage'),
          timeout
        ]);

        const data = response.data;
        const pods = data.pods || [];
        const versions = data.versions || [];

        setMemoryData({
          pods: pods.map(pod => ({ name: pod.name || `Pod ${pod.id}`, memory: pod.memory || 0 })),
          versions: versions.map(ver => ({ name: ver.name || `Version ${ver.id}`, memory: ver.memory || 0 }))
        });

        setTotalMemory([...pods, ...versions].reduce((acc, item) => acc + (item.memory || 0), 0));
        setIsApiError(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsApiError(true);
        setTotalMemory(0);
        setTimeout(() => window.location.reload(), 30000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemoryData();
    const interval = setInterval(fetchMemoryData, 500);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: [
      ...memoryData.pods.map(pod => pod.name),
      ...memoryData.versions.map(ver => ver.name)
    ],
    datasets: [
      {
        label: 'Main Pods',
        data: memoryData.pods.map(pod => pod.memory),
        backgroundColor: colors.slice(0, memoryData.pods.length),
        borderWidth: 0,
        borderRadius: 4,
        spacing: 1,
        radius: '65%'
      },
      {
        label: 'Sub Versions',
        data: memoryData.versions.map(ver => ver.memory),
        backgroundColor: colors.slice(5, 5 + memoryData.versions.length),
        borderWidth: 0,
        borderRadius: 8,
        spacing: 2,
        radius: '50%'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    hover: {
      mode: 'nearest',
      intersect: false,
    },
    layout: {
      margin: { left: 0 }
    },
    plugins: {
      legend: {
        display: false, // Disable the legend
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label === 'Main Pods' 
              ? `Pod ${context.dataIndex + 1}`
              : `Version ${context.dataIndex + 1}`;
            return `${label}: ${context.raw} MB (${((context.raw / totalMemory) * 100).toFixed(1)}%)`;
          }
        }
      },
      datalabels: {
        display: true,
        color: '#000',
        font: { weight: 'bold', size: 8 },
        formatter: (value) => `${((value / totalMemory) * 100).toFixed(1)}%`
      }
    },
    elements: {
      arc: {
        hoverBorderWidth: 3,
        hoverBorderColor: '#FFFFDC',
        hoverBackgroundColor: (context) => {
          const index = context.dataIndex;
          const datasetIndex = context.datasetIndex;
          return context.chart.data.datasets[datasetIndex].backgroundColor[index];
        },
        hoverRadius: (context) => {
          if (context.active) {
            return context.chart.getDatasetMeta(context.datasetIndex).data[context.dataIndex].outerRadius + 5;
          }
          return context.chart.getDatasetMeta(context.datasetIndex).data[context.dataIndex].outerRadius;
        }
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '680px', marginBottom: '0px', left: '30px' }}>
      {isApiError ? (
        <div className="loading-container" style={{ top: '185px', left: '150px', position: 'absolute' }}>
          <div className="loading-spinner"></div>
          <span className="spinner-arrow"></span>
        </div>
      ) : isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px', position: 'relative' }}>
          <div className="loading-spinner"></div>
          <span className="spinner-arrow"></span>
        </div>
      ) : (
        <>
          <Doughnut data={chartData} options={chartOptions} />

          {totalMemory > 0 && (
            <div className="memory-display" style={{ 
              top: '310px', //305px
              left: '120px', //555px
              textAlign: 'center', 
              color: '#9A9A9A', 
              fontSize: '0.8em', 
              position: 'absolute' 
            }}>
              <h3>K8s Api Server Memory Usage</h3>
              <span className="memory-label">Total Memory: </span>
              <span className="memory-value">{totalMemory}</span> MB
            </div>
          )}
        </>
      )}
      
      {/* LiveBar positioned in the top right */}
      <div style={{
        position: 'absolute',
        top: '0px',
        right: '20px',
        bottom: '0px',
        padding: '0px 0px',
        borderRadius: '5px',
        fontSize: '10px',
        fontWeight: 'bold',
      }}>
        <LiveBar isActive={!isApiError} />
      </div>
      
    </div>
  );
};

export default MemoryUsageChart;

