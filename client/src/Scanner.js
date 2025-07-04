import React, { useState } from "react";

const Log = () => {
  const [ipInput, setIpInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      checkDevice();
    }
  };

  const checkDevice = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/check-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: ipInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        setResult({ error: data.error || "Unknown error" });
      } else {
        setResult({ url: data.url || `http://${ipInput}/` });
      }
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const openDeviceUI = () => {
    const url = result?.url || `http://${ipInput}/`;
    window.open(url, "_blank");
  };

  return (
    <div>
      <h2>Check Device</h2>

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
        onClick={checkDevice}
        disabled={loading || !ipInput.trim()}
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
        {loading ? "Checking..." : "➜"}
      </button>

      {result && (
        <div style={{ marginTop: "1rem" }}>
          {!result.error ? (
            <>
              <button
                onClick={openDeviceUI}
                style={{
                  marginBottom: "0.5rem",
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Open Device Interface<br />
                {ipInput}
              </button>
              <p>
                Try manually opening:{" "}
                <a
                  href={`http://${ipInput}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  http://{ipInput}/
                </a>
              </p>
            </>
          ) : (
            <p style={{ color: "red" }}>{result.error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Log;

  
//   import React, { useState } from "react";

//  const Log = () => {
//   const [ip, setIp] = useState("");
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const checkDevice = async () => {
//     setLoading(true);
//     setResult(null);
//     try {
//       const res = await fetch("/api/check-device", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ip }),
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         setResult({ error: err.error || "Unknown error" });
//       } else {
//         const data = await res.json();
//         setResult({ url: data.url });
//       }
//     } catch (err) {
//       setResult({ error: err.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Check Device </h2>
//       <input
//         type="text"
//         placeholder="Enter device IP or URL"
//         value={ip}
//         onChange={(e) => setIp(e.target.value)}
//         style={{ width: "250px" }}
//       />
//       <button onClick={checkDevice} disabled={loading || !ip.trim()}>
//         {loading ? "Checking..." : "Check"}
//       </button>

//       {result && (
//         <div style={{ marginTop: "1rem" }}>
//           {result.url && (
//             <p>
//               Device page found:{" "}
//               <a href={result.url} target="_blank" rel="noopener noreferrer">
//                 {result.url}
//               </a>
//             </p>
//           )}
//           {result.error && <p style={{ color: "red" }}>{result.error}</p>}
//         </div>
//       )}
//     </div>
//   );
// }
// export default Log;