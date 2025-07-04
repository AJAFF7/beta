import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { motion } from "framer-motion";





// Function to create a JSON backup and download it
const backupLocalStorage = (setStatusMessage) => {
  const data = JSON.stringify(localStorage);
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "localStorage_backup.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setStatusMessage(
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.5 }}
      style={{
        color: "#000",
        marginTop: "15px",
        backgroundColor: "rgba(255, 255, 220, 1)",
        borderRadius: "3px",
        padding: "2px",
        border: "1px solid black",
        display: "inline-block",
      }}
    >
      Backup created successfully! Downloading...
    </motion.div>
  );
};

// Function to restore localStorage from a JSON file
const restoreFromBackupFile = (event, setStatusMessage) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const backupData = JSON.parse(e.target.result);
      for (const key in backupData) {
        localStorage.setItem(key, backupData[key]);
      }

      setStatusMessage(
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5 }}
          style={{
            color: "#000",
            marginTop: "15px",
            backgroundColor: "rgba(255, 255, 220, 1)",
            borderRadius: "3px",
            padding: "2px",
            border: "1px solid black",
            display: "inline-block",
          }}
        >
          Local storage restored from backup!
        </motion.div>
      );
      
      // Refresh the page after showing the message
      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 100);
      
    } catch (error) {
      setStatusMessage(
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5 }}
          style={{
            color: "red",
            marginTop: "15px",
            backgroundColor: "rgba(255, 255, 220, 1)",
            borderRadius: "5px",
            padding: "8px",
            border: "1px solid red",
            display: "inline-block",
          }}
        >
          Error restoring backup! Invalid file.
        </motion.div>
      );
    }
  };
  reader.readAsText(file);
};

function Buttons1() {
  const storedServices =
    JSON.parse(localStorage.getItem("services")) || [
      { name: "semaphore", isOn: false },
      { name: "crm", isOn: false },
      { name: "draw", isOn: false },
      { name: "uptime", isOn: false },
      { name: "cloudflare", isOn: false },
      { name: "dms", isOn: false },
      { name: "mongo", isOn: false },
      { name: "istio", isOn: false },
      { name: "rabbitmqx", isOn: false },
    ];

  const [services, setServices] = useState(storedServices);
  const [newService, setNewService] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [scriptRunning, setScriptRunning] = useState(false);
    const [backupServices, setBackupServices] = useState([]); // Backup state
  const inputRef = useRef(null);

  useEffect(() => {
    services.forEach((service) => {
      if (!service.isOn) {
        fetchStatus(service.name);
      }
    });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("services", JSON.stringify(services));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [services]);

  const fetchStatus = (serviceName) => {
    fetch(`http://localhost:3535/${serviceName}-status`)
      .then((response) => response.text())
      .then((data) => {
        const isOn = data.includes(
          `${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} is applied`
        );
        setServices((prevServices) =>
          prevServices.map((s) =>
            s.name === serviceName ? { ...s, isOn } : s
          )
        );
      })
      .catch((error) =>
        console.error(`Error fetching ${serviceName} status:`, error)
      );
  };

  const toggleService = (serviceName, isOn) => {
    const action = isOn ? "delete" : "apply";

    // Optimistic UI update
    setServices((prevServices) =>
      prevServices.map((s) =>
        s.name === serviceName ? { ...s, isOn: !isOn } : s
      )
    );

    fetch(`http://localhost:3535/${action}-${serviceName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to ${action} ${serviceName}`);
        }
        return response.text();
      })
      .then((message) => {
        console.log(message);
      })
      .catch((error) => {
        // Revert to previous state if fetch fails
        setServices((prevServices) =>
          prevServices.map((s) =>
            s.name === serviceName ? { ...s, isOn } : s
          )
        );
        setStatusMessage(`Error ${action}ing ${serviceName}: ` + error.message);
      });
  };

  const runScript = () => {
    if (!scriptRunning) {
      fetch("/3535/start-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to start script");
          }
          return response.text();
        })
        .then((message) => {
          console.log(message);
          setScriptRunning(true);
          setStatusMessage("Script started successfully.");
        })
        .catch((error) => {
          setStatusMessage("Error running script: " + error.message);
        });
    } else {
      fetch("/3535/stop-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to stop script");
          }
          return response.text();
        })
        .then((message) => {
          console.log(message);
          setScriptRunning(false);
          setStatusMessage("Script stopped successfully.");
        })
        .catch((error) => {
          setStatusMessage("Error stopping script: " + error.message);
        });
    }
  };

  const openFileInEditor = (serviceName) => {
    fetch("http://localhost:3535/open-file", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ serviceName }),
    })
      .then((response) => {
        if (response.ok) {
          setStatusMessage(`${serviceName}.yaml opened in editor`);
        } else {
          setStatusMessage(`Failed to open ${serviceName}.yaml`);
        }
      })
      .catch((error) => {
        setStatusMessage(`Error opening file: ${error}`);
      });
  };

  const addService = () => {
    const trimmedService = newService.trim().toLowerCase();

    if (!trimmedService) {
      setStatusMessage("Service name cannot be empty.");
      return;
    }

    if (services.some((s) => s.name.toLowerCase() === trimmedService)) {
      setStatusMessage(`Service "${trimmedService}" already exists.`);
      return;
    }

    const updatedServices = [
      ...services,
      { name: trimmedService, isOn: false },
    ];

    setServices(updatedServices);
    setNewService("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const deleteService = (serviceName) => {
    if (!window.confirm(`Are you sure you want to delete "${serviceName}"?`))
      return;

    const updatedServices = services.filter(
      (service) => service.name !== serviceName
    );
    setServices(updatedServices);
  };





  const clearLocalStorage = () => {
    if (window.confirm("Are you sure you want to clear the local storage?")) {
      setBackupServices(services); // Backup before clearing
      localStorage.removeItem("services"); // Removes the services from localStorage
      setServices([]); // Clears the current services state
      setStatusMessage(
      <motion.div
        initial={{ opacity: 0, x: -300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          color: "#000",
          marginTop: "15px",
          backgroundColor: "#8BB4D2",
          borderRadius: "3px",
          padding: "2px",
          border: "1px solid green",
          display: "inline-block",
          fontSize: "15px"
        }}
      >
        Local storage cleared successfully
      </motion.div>
    );
    
    setTimeout(() => {
      setStatusMessage(null); // This removes the message from the UI
    }, 2000);
  } else {
    setStatusMessage(
      <motion.div
        initial={{ opacity: 0, x: -300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          color: "red",
          marginTop: "15px",
          backgroundColor: "#E2C6C8",
          borderRadius: "3px",
          padding: "2px",
          border: "1px solid red",
          display: "inline-block",
          fontSize: "15px"
        }}
      >
        Clear action Skipped
      </motion.div>
     );
     
     setTimeout(() => {
      setStatusMessage(null); // This removes the message from the UI
    }, 2000);
    }
  };

  

const restoreLocalStorage = () => {
  if (backupServices.length > 0) {
    setServices(backupServices); // Restore from backup
    localStorage.setItem("services", JSON.stringify(backupServices)); // Save to localStorage
    setStatusMessage(
      <motion.div
        initial={{ opacity: 0, x: -300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          color: "#000",
          marginTop: "15px",
          backgroundColor: "#BAE6BA",
          borderRadius: "3px",
          padding: "2px",
          border: "1px solid green",
          display: "inline-block",
          fontSize: "15px"
        }}
      >
        Local storage restored successfully
      </motion.div>
    );
    
    setTimeout(() => {
      setStatusMessage(null); // This removes the message from the UI
    }, 2000);
  } else {
    setStatusMessage(
      <motion.div
        initial={{ opacity: 0, x: -300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          color: "red",
          marginTop: "15px",
          backgroundColor: "#E2C6C8",
          borderRadius: "3px",
          padding: "2px",
          border: "1px solid red",
          display: "inline-block",
          fontSize: "15px"
        }}
      >
        No data to restore
      </motion.div>
    );
    
    setTimeout(() => {
      setStatusMessage(null); // This removes the message from the UI
    }, 2000);
  }
};





  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("draggedIndex", index);
  };

  const handleDrop = (e, targetIndex) => {
    const draggedIndex = e.dataTransfer.getData("draggedIndex");
    const updatedServices = [...services];
    const [draggedService] = updatedServices.splice(draggedIndex, 1);
    updatedServices.splice(targetIndex, 0, draggedService);
    setServices(updatedServices);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop
  };

  useEffect(() => {
    if (statusMessage) {
      const timeout = setTimeout(() => {
        setStatusMessage("");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [statusMessage]);
  
  
 

  return (
    <div className="container-b">
      <h2 className="h2b">Pod Controller</h2>
      <div className="services-list">
        {services.map((service, index) => (
          <div
            key={service.name}
            className="service-item"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
          >
            <span
              className="service-name"
              onClick={() => openFileInEditor(service.name)}
              style={{ cursor: "pointer" }}
            >
              {service.name}
            </span>
            <label className="switch">
              <input
                type="checkbox"
                checked={service.isOn}
                onChange={() => toggleService(service.name, service.isOn)}
              />
              <span className="slider"></span>
            </label>

            <button
              className="script-btn"
              style={{
                color: service.isOn ? "#FFA500" : "#98FB98", // Red for Pause, Green for Play
                width: "20px", // Circle width
                height: "20px", // Circle height
                borderRadius: "50%", // Make it circular
                display: "flex", // Use flexbox to center the text
                justifyContent: "center", // Center horizontally
                alignItems: "center", // Center vertically
                fontSize: "14px", // Adjust font size for better fitting
                fontWeight: "bold", // Make the symbol bold
                textAlign: "center", // Ensure text alignment is centered
                padding: "0", // Remove padding to maintain the circle shape
                backgroundColor: "transparent", // Remove background
                border: "none", // Remove button border
              }}
              onClick={() => toggleService(service.name, service.isOn)}
            >
              {service.isOn ? "⏸" : "▶"} {/* Play and Pause symbols */}
            </button>

            


<button
  className="delete-btn"
  onClick={() => deleteService(service.name)}
>
  <img
    src="/trash.png"  // Directly reference from the public directory
    alt="Delete"
    className="submit-img"
    style={{
      width: "15px", 
      height: "15px", 
      cursor: "pointer"
    }}
  />
</button>


            
            
          </div>
        ))}
      </div>

      <div className="add-service">
        <div className="input-container" style={{ position: "relative" }}>
          <input
            type="text"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addService();
              }
            }}
            placeholder="Enter service name"
            className="service-input"
            ref={inputRef}
          />
          <div className="backup-b">
          <span
            onClick={() => backupLocalStorage(setStatusMessage)}>
            
    <img
    src="/backup.png"  // Directly reference from the public directory
    alt="Backup"
    className="submit-img"
    style={{
      width: "19px", 
      height: "19px", 
      position: "absolute",
      right: "0px",
      top: "30%",
      cursor: "pointer"
    }}
  />
            
         {/* Backup button  ↻ */}
          </span>
          <input
            type="file"
            accept=".json"
            onChange={(event) => restoreFromBackupFile(event, setStatusMessage)}
            style={{
              display: "none",
            }}
          />
          <span
            onClick={() => document.querySelector('input[type="file"]').click()} >
            
           <img
    src="/restore.png"  // Directly reference from the public directory
    alt="Restore"
    className="submit-img"
    style={{
      width: "20px", 
      height: "20px", 
      position: "absolute",
      left: "200px",
      top: "30%",
      cursor: "pointer"
    }}
  />
           
           {/* Restore button ➡     */}
          </span>
          
          
          
          {/* <span
      onClick={clearLocalStorage}>
      
      <img
    src="/clearup.png"  // Directly reference from the public directory
    alt="Clearup"
    className="submit-img"
    style={{
      width: "20px", 
      height: "20px", 
      position: "absolute",
      left: "225px",
      top: "30%",
      cursor: "pointer"
    }}
  />
      
    
    </span> */}

    {/* <span
      onClick={restoreLocalStorage}
      className="restore-btn">
      
      <img
    src="/cleardn.png"  // Directly reference from the public directory
    alt="Cleardn"
    className="submit-img"
    style={{
      width: "20px", 
      height: "20px", 
      position: "absolute",
      left: "250px",
      top: "30%",
      cursor: "pointer"
    }}
  />
      
      
   
    </span> */}
          
       </div>   
          
        </div>
      </div>

      {statusMessage && <div className="status-message">{statusMessage}</div>}
    </div>
  );
}

export default Buttons1;

