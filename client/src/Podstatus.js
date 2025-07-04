import React, { useState } from "react";

const ConnectedDevices = () => {
  const [ipInput, setIpInput] = useState("");
  const [webviewUrl, setWebviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openDeviceUI = async () => {
    setError("");
    setWebviewUrl("");

    let rawIp = ipInput.trim();
    if (!rawIp) {
      alert("Please enter a valid IP address.");
      return;
    }

    // Add http:// if not present
    if (!/^https?:\/\//i.test(rawIp)) {
      rawIp = "http://" + rawIp;
    }

    try {
      const parsedUrl = new URL(rawIp);

      // If no file in path, append login.html
      const hasPathFile = /\/[^/]+\.(html?|php|asp|aspx)$/i.test(parsedUrl.pathname);
      if (!hasPathFile || parsedUrl.pathname === "/") {
        rawIp = `${parsedUrl.origin}/login.html`;
      }
    } catch {
      setError("Invalid IP address format.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3535/api/check-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: rawIp }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Device not reachable");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setWebviewUrl(data.url);
      setLoading(false);
    } catch (e) {
      setError("Network error or backend not running");
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") openDeviceUI();
  };

  return (
    <div style={{ padding: "1rem", position: "relative", minHeight: "200px" }}>
      <h2 style={{ color: "555" }}>Open Device UI</h2>
      <br />

      <input
        type="text"
        placeholder="Enter IP address"
        value={ipInput}
        onChange={(e) => setIpInput(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          backgroundColor: "#555",
          padding: "0.6rem 1rem",
          width: "200px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          fontSize: "16px",
          outline: "none",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          color: "#dbdbdb",
          fontWeight: "bold",
        }}
      />

      <button
        onClick={openDeviceUI}
        style={{
          marginLeft: "1rem",
          padding: "0.6rem 1.2rem",
          backgroundColor: "#5e3922",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          transition: "background 0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#9e3922")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#5e3922")}
      >
        ➜
      </button>

      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              border: "6px solid rgba(255, 255, 255, 0.2)",
              borderTop: "6px solid #ffffff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginTop: "100px", // adjust as needed
              marginLeft: "370px",
            }}
          />
        </div>
      )}

      {error && !loading && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#222",
            padding: "20px 30px",
            borderRadius: "10px",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#fff",
            animation: "scaleUp 0.4s ease-out",
            // animation: "fadeIn 0.4s ease-out",
            zIndex: 9999,
            //boxShadow: "0px 0px 6px 1px #777", //boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            marginTop: "30px", // adjust as needed
            marginLeft: "190px",
          }}
        >
          invalid IP address or device not reachable
        </div>
      )}

      {webviewUrl && !loading && !error && (
        <div
          style={{
            marginTop: "0.7rem",
            backgroundColor: "#555",
            padding: "0.4rem",
            borderRadius: "8px",
            border: "1px solid #444",
            boxShadow: "0px 0px 8px #000",
          }}
        >
          <iframe
            src={webviewUrl}
            title="Device UI"
            width="100%"
            height="900px"
            style={{
              border: "none",
              borderRadius: "8px",
            }}
          ></iframe>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -60%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
    </div>
  );
};

export default ConnectedDevices;

// import React, { useState } from "react";

// const ConnectedDevices = () => {
//   const [ipInput, setIpInput] = useState("");
//   const [webviewUrl, setWebviewUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);

//   const openDeviceUI = () => {
//     let url = ipInput.trim();
//     setError(false);
//     setWebviewUrl("");

//     if (!url) {
//       alert("Please enter a valid IP address.");
//       return;
//     }

//     // Prepend protocol if missing
//     if (!/^https?:\/\//i.test(url)) {
//       url = "http://" + url;
//     }

//     try {
//       const parsedUrl = new URL(url);

//       // If no specific path (like /login.html), append it
//       const hasPathFile = /\/[^/]+\.(html?|php|asp|aspx)$/i.test(parsedUrl.pathname);
//       if (!hasPathFile || parsedUrl.pathname === "/") {
//         url = `${parsedUrl.origin}/login.html`;
//       }
//     } catch {
//       setError(true);
//       return;
//     }

//     setLoading(true);

//     // Simulate loading then show iframe
//     setTimeout(() => {
//       setWebviewUrl(url);
//       setLoading(false);
//     }, 1000);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       openDeviceUI();
//     }
//   };

//   return (
//     <div style={{ padding: "1rem", position: "relative", minHeight: "200px" }}>
//       <h2 style={{ color: "#555" }}>Open Device UI</h2>
//       <br />

//       <input
//         type="text"
//         placeholder="Enter IP address"
//         value={ipInput}
//         onChange={(e) => setIpInput(e.target.value)}
//         onKeyDown={handleKeyDown}
//         style={{
//           backgroundColor: "#555",
//           padding: "0.6rem 1rem",
//           width: "200px",
//           border: "1px solid #ccc",
//           borderRadius: "8px",
//           fontSize: "16px",
//           outline: "none",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
//           color: "#dbdbdb",
//           fontWeight: "bold",
//         }}
//       />

//       <button
//         onClick={openDeviceUI}
//         style={{
//           marginLeft: "1rem",
//           padding: "0.6rem 1.2rem",
//           backgroundColor: "#5e3922",
//           color: "#fff",
//           border: "none",
//           borderRadius: "8px",
//           fontSize: "16px",
//           cursor: "pointer",
//           boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//           transition: "background 0.3s",
//         }}
//         onMouseOver={(e) => (e.target.style.backgroundColor = "#9e3922")}
//         onMouseOut={(e) => (e.target.style.backgroundColor = "#5e3922")}
//       >
//         ➜
//       </button>

//       {loading && (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             backgroundColor: "rgba(0,0,0,0.4)",
//             zIndex: 9999,
//           }}
//         >
//           <div
//             style={{
//               width: "80px",
//               height: "80px",
//               border: "6px solid rgba(255, 255, 255, 0.2)",
//               borderTop: "6px solid #ffffff",
//               borderRadius: "50%",
//               animation: "spin 1s linear infinite",
//             }}
//           />
//         </div>
//       )}

//       {error && !loading && (
//         <div
//           style={{
//             position: "fixed",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             backgroundColor: "#222",
//             padding: "20px 30px",
//             borderRadius: "10px",
//             fontSize: "18px",
//             fontWeight: "bold",
//             color: "#fff",
//             animation: "scaleUp 0.4s ease-out",
//             zIndex: 9999,
//           }}
//         >
//           Invalid IP address or device not reachable
//         </div>
//       )}

//       {webviewUrl && !loading && !error && (
//         <div
//           style={{
//             marginTop: "0.7rem",
//             backgroundColor: "#555",
//             padding: "0.4rem",
//             borderRadius: "8px",
//             border: "1px solid #444",
//             boxShadow: "0px 0px 8px #000",
//           }}
//         >
//           <iframe
//             src={webviewUrl}
//             title="Device UI"
//             width="100%"
//             height="900px"
//             style={{
//               border: "none",
//               borderRadius: "8px",
//             }}
//           ></iframe>
//         </div>
//       )}

//       <style>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//         @keyframes scaleUp {
//           from { transform: scale(0.9) translate(-50%, -50%); opacity: 0; }
//           to { transform: scale(1) translate(-50%, -50%); opacity: 1; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ConnectedDevices;


//////////////


// import React, { useState } from "react";

// const ConnectedDevices = () => {
//   const [ipInput, setIpInput] = useState("");
//   const [webviewUrl, setWebviewUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);

//   const openDeviceUI = async () => {
//     let url = ipInput.trim();
//     setError(false); // reset error

//     if (!url) {
//       alert("Please enter a valid IP address.");
//       return;
//     }

//     if (!url.startsWith("http://") && !url.startsWith("https://")) {
//       url = "http://" + url;
//     }

//     setLoading(true);
//     try {
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 3000);

//       await fetch(url, {
//         method: "GET",
//         mode: "no-cors",
//         signal: controller.signal,
//       });

//       clearTimeout(timeoutId);
//       setWebviewUrl(url);
//       setLoading(false);
//     } catch (err) {
//       setTimeout(() => {
//         setLoading(false);
//         setError(true);
//       }, 2000); // show spinner first, then error
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       openDeviceUI();
//     }
//   };

  // return (
  //   <div style={{ padding: "1rem", position: "relative", minHeight: "200px" }}>
  //     <h2 style={{ color: "555" }}>Open Device UI</h2>
  //     <br />

  //     <input
  //       type="text"
  //       placeholder="Enter IP address"
  //       value={ipInput}
  //       onChange={(e) => setIpInput(e.target.value)}
  //       onKeyDown={handleKeyDown}
  //       style={{
  //         backgroundColor: "#555",
  //         padding: "0.6rem 1rem",
  //         width: "200px",
  //         border: "1px solid #ccc",
  //         borderRadius: "8px",
  //         fontSize: "16px",
  //         outline: "none",
  //         boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  //         color: "#dbdbdb",
  //         fontWeight: "bold",
  //       }}
  //     />

  //     <button
  //       onClick={openDeviceUI}
  //       style={{
  //         marginLeft: "1rem",
  //         padding: "0.6rem 1.2rem",
  //         backgroundColor: "#5e3922",
  //         color: "#fff",
  //         border: "none",
  //         borderRadius: "8px",
  //         fontSize: "16px",
  //         cursor: "pointer",
  //         boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  //         transition: "background 0.3s",
  //       }}
  //       onMouseOver={(e) => (e.target.style.backgroundColor = "#9e3922")}
  //       onMouseOut={(e) => (e.target.style.backgroundColor = "#5e3922")}
  //     >
  //       ➜
  //     </button>

  //     {loading && (
  //       <div
  //         style={{
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           position: "fixed",
  //           top: 0,
  //           left: 0,
  //           width: "100vw",
  //           height: "100vh",
  //           backgroundColor: "rgba(0,0,0,0.4)",
  //           zIndex: 9999,
  //         }}
  //       >
  //         <div
  //           style={{
  //             width: "80px",
  //             height: "80px",
  //             border: "6px solid rgba(255, 255, 255, 0.2)",
  //             borderTop: "6px solid #ffffff",
  //             borderRadius: "50%",
  //             animation: "spin 1s linear infinite",
  //             marginTop: "100px", // adjust as needed
  //             marginLeft: "370px",
  //           }}
  //         />
  //       </div>
  //     )}

  //     {error && !loading && (
  //       <div
  //         style={{
  //           position: "fixed",
  //           top: "50%",
  //           left: "50%",
  //           transform: "translate(-50%, -50%)",
  //           backgroundColor: "#222",
  //           padding: "20px 30px",
  //           borderRadius: "10px",
  //           fontSize: "18px",
  //           fontWeight: "bold",
  //           color: "#fff",
  //           animation: "scaleUp 0.4s ease-out",
  //           // animation: "fadeIn 0.4s ease-out",
  //           zIndex: 9999,
  //           //boxShadow: "0px 0px 6px 1px #777", //boxShadow: "0 0 10px rgba(0,0,0,0.5)",
  //           marginTop: "30px", // adjust as needed
  //           marginLeft: "190px",
  //         }}
  //       >
  //         Invalid IP address or device not reachable
  //       </div>
  //     )}

  //     {webviewUrl && !loading && !error && (
  //       <div
  //         style={{
  //           marginTop: "0.7rem",
  //           backgroundColor: "#555",
  //           padding: "0.4rem",
  //           borderRadius: "8px",
  //           border: "1px solid #444",
  //           boxShadow: "0px 0px 8px #000",
  //         }}
  //       >
  //         <iframe
  //           src={webviewUrl}
  //           title="Device UI"
  //           width="100%"
  //           height="900px"
  //           style={{
  //             border: "none",
  //             borderRadius: "8px",
  //           }}
  //         ></iframe>
  //       </div>
  //     )}

  //     <style>{`
  //       @keyframes spin {
  //         0% { transform: rotate(0deg); }
  //         100% { transform: rotate(360deg); }
  //       }
  //       @keyframes fadeIn {
  //         from { opacity: 0; transform: translate(-50%, -60%); }
  //         to { opacity: 1; transform: translate(-50%, -50%); }
  //       }
  //     `}</style>
  //   </div>
  // );
// };

// export default ConnectedDevices;


////////////

