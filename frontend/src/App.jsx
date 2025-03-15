import React, { useEffect, useState } from "react";
import DivyaLinkInterface from "./components/DivyaLinkInterface";
const BACKEND_URL = "ws://localhost:8000/ws"; // WebSocket connection

function App() {
  const [telemetry, setTelemetry] = useState({
    altitude: 0,
    yaw: 0,
    latitude: null,
    longitude: null,
    groundSpeed: 0, // ✅ Added ground speed
    verticalSpeed: 0, // ✅ Added vertical speed
    heading: 0,
  });
  const [Data,setData] = useState([]);

  const [logs, setLogs] = useState([]); // ✅ State to store logs

  useEffect(() => {
    let socket = new WebSocket(BACKEND_URL);

    socket.onopen = () => {
      console.log("✅ [WebSocket] Connected to server at", BACKEND_URL);
     
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📡 [WebSocket] Received Data:", data);

        if (!data || typeof data !== "object") {
          console.error("⚠️ [WebSocket] Invalid data received:", event.data);
          
          return;
        }
        setData(data.raw_data)
        // ✅ Store telemetry data
        setTelemetry((prev) => ({
          ...prev,
          altitude: data.altitude ?? prev.altitude,
          yaw: data.yaw_degrees ?? prev.yaw,
          latitude: data.latitude ?? prev.latitude,
          longitude: data.longitude ?? prev.longitude,
          groundSpeed: data.ground_speed ?? prev.groundSpeed, // ✅ Added
          verticalSpeed: data.vertical_speed ?? prev.verticalSpeed, // ✅ Added
          heading: data.heading ?? prev.heading,
        }));

        // ✅ Store log messages if present
        if (data.log_message) {
          addLog(data.log_message);
        }
      } catch (error) {
        console.error("❌ [WebSocket] Error parsing message:", error);
        addLog("❌ Error parsing WebSocket message");
      }
    };

    socket.onerror = (error) => {
      console.error("❌ [WebSocket] Connection Error:", error);
      
    };

    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(
          `ℹ️ [WebSocket] Connection closed cleanly (code: ${event.code}, reason: ${event.reason})`
        );
       
      } else {
        console.warn("⚠️ [WebSocket] Connection closed unexpectedly!");
        
      }
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        console.log("⚠️ [WebSocket] Closing connection...");
        
        socket.close();
      }
    };
  }, []);

  // ✅ Function to add logs with limit
  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs.slice(-49), message]); // Keep last 50 logs
  };
  const takeoff = async () => {
    const altitude = prompt("Enter takeoff altitude (m):", "10"); // Default: 10m
    if (!altitude) return;

    try {
      const response = await fetch(
        `http://localhost:8000/takeoff/${altitude}`,
        { method: "POST" }
      );
      const data = await response.json();
      console.log("🛫 Takeoff Response:", data);
      addLog(data.message);
    } catch (error) {
      console.error("❌ Takeoff Failed:", error);
      addLog("❌ Takeoff command failed");
    }
  };
  const changeAltitude = async () => {
    const altitude = prompt("Enter new altitude (meters):", "20"); // Default 20m
    if (!altitude || isNaN(altitude)) {
      alert("❌ Please enter a valid number!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/change_altitude/${altitude}`, {
        method: "POST",
      });
      const data = await response.json();

      console.log("📡 Altitude Change Response:", data);
      addLog(data.message || "Altitude change requested.");
    } catch (error) {
      console.error("❌ Altitude Change Failed:", error);
      addLog("❌ Failed to change altitude.");
    }
  };

  const land = async () => {
    try {
      const response = await fetch("http://localhost:8000/land", {
        method: "POST",
      });
      const data = await response.json();
      console.log("🛬 Landing Response:", data);
      addLog(data.message);
    } catch (error) {
      console.error("❌ Landing Failed:", error);
      addLog("❌ Landing command failed");
    }
  };

  return (
    <>
    {/*  <div
        className="App"
        style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}
      >
        <h1>🚁 Drone Telemetry</h1>

        {/* Telemetry Data Section 
        <div
          style={{
            display: "inline-block",
            backgroundColor: "#f0f0f0",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          <p>
            <strong>🛫 Altitude:</strong> {telemetry.altitude} m
          </p>
          <p>
            <strong>🧭 Yaw (Heading):</strong> {telemetry.yaw}°
          </p>
          <p>
            <strong>📍 Latitude:</strong> {telemetry.latitude ?? "N/A"}
          </p>
          <p>
            <strong>📍 Longitude:</strong> {telemetry.longitude ?? "N/A"}
          </p>
        </div>

        {/* Status Log Section 
        <div
          style={{
            backgroundColor: "#222",
            color: "#fff",
            padding: "10px",
            borderRadius: "10px",
            maxWidth: "500px",
            margin: "auto",
            textAlign: "left",
            height: "200px",
            overflowY: "auto",
          }}
        >
          
          <h3>Status Log</h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {logs.map((log, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                📝 {log}
              </li>
            ))}
          </ul>
        </div>
        <button
            onClick={takeoff}
            style={{
              marginRight: "10px",
              padding: "10px",
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            🛫 Takeoff
          </button>
          <button
            onClick={land}
            style={{
              padding: "10px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            🛬 Land
          </button>
      </div>*/}
     <DivyaLinkInterface telemetry={telemetry} logs={logs} takeoff={takeoff} changeAltitude={changeAltitude} land={land}/>
    </>
  );
}

export default App;
