import React, { useEffect, useState } from "react";
import DivyalinkInterface from "./components/DivyaLinkInterface";

const BACKEND_URL = "ws://localhost:8000/ws"; // WebSocket connection

function App() {
  const [telemetry, setTelemetry] = useState({
    altitude: 0,
    yaw: 0,
    latitude: null,
    longitude: null,
  });

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

        setTelemetry((prev) => ({
          ...prev,
          altitude: data.altitude ?? prev.altitude,
          yaw: data.yaw_degrees ?? prev.yaw,
          latitude: data.latitude ?? prev.latitude,
          longitude: data.longitude ?? prev.longitude,
        }));
      } catch (error) {
        console.error("❌ [WebSocket] Error parsing message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("❌ [WebSocket] Connection Error:", error);
    };

    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(`ℹ️ [WebSocket] Connection closed cleanly (code: ${event.code}, reason: ${event.reason})`);
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

  return (
    <>
   {/* <div className="App" style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1>🚁 Drone Telemetry</h1>
      <div style={{
        display: "inline-block",
        backgroundColor: "#f0f0f0",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        <p><strong>🛫 Altitude:</strong> {telemetry.altitude} m</p>
        <p><strong>🧭 Yaw (Heading):</strong> {telemetry.yaw}°</p>
        <p><strong>📍 Latitude:</strong> {telemetry.latitude ?? "N/A"}</p>
        <p><strong>📍 Longitude:</strong> {telemetry.longitude ?? "N/A"}</p>
      </div>
    </div>*/}
    <DivyalinkInterface/></>
  );
}

export default App;