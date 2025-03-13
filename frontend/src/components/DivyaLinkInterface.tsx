"use client";

import { useState, useEffect } from "react";
import { Database, Globe, Settings, Sliders, PlayCircle, HelpCircle, Plane, Home, Play, ArrowUp, MapPin, Compass } from "lucide-react";
import DroneMap from "./DroneMap";
import NavButton from "./NavButton";
import ActionButton from "./ActionButton";
import TabButton from "./TabButton";
import TelemetryItem from "./TelemetryItem";
import React from "react";

export default function DivyalinkInterface() {
  const [connected, setConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00:00");
  const [activeTab, setActiveTab] = useState("DATA");
  const [isArmed, setIsArmed] = useState(false);
  const [flyHereMode, setFlyHereMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [activeTabButton, setActiveTabButton] = useState("Quick");
  const [droneData, setDroneData] = useState({
    altitude: 120.5,
    groundSpeed: 15.3,
    verticalSpeed: 1.2,
    yaw: 45.0,
    satellites: 8,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      const time = date.toLocaleTimeString();
      setCurrentTime(time);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNavClick = (tabName) => {
    setActiveTab(tabName);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleTabButtonClick = (tabName) => {
    setActiveTabButton(tabName);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const toggleArmed = () => {
    setIsArmed(!isArmed);
    setStatusMessage(isArmed ? "Drone disarmed successfully." : "Drone armed successfully. Ready for flight.");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleTakeoff = () => {
    setStatusMessage("Takeoff initiated. Ascending to 10m altitude.");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleLand = () => {
    setStatusMessage("Landing sequence initiated. Preparing for descent.");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleMissionStart = () => {
    setStatusMessage("Mission started. Executing pre-programmed flight plan.");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleReturnHome = () => {
    setStatusMessage("Return to home activated. Returning to launch point.");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleChangeAltitude = () => {
    setStatusMessage("Altitude change requested. Adjusting flight level.");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const toggleFlyHereMode = () => {
    setFlyHereMode(!flyHereMode);
    setStatusMessage(flyHereMode ? "Fly Here mode deactivated." : "Fly Here mode activated. Click on map to set destination.");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-900 text-white select-none">
      <div className="flex justify-between items-center bg-purple-900 p-2 shadow-md">
        <div className="flex space-x-2">
          <NavButton icon={<Database size={18} />} label="DATA" active={activeTab === "DATA"} onClick={() => handleNavClick("DATA")} />
          <NavButton icon={<Globe size={18} />} label="PLAN" active={activeTab === "PLAN"} onClick={() => handleNavClick("PLAN")} />
          <NavButton icon={<Settings size={18} />} label="SETUP" active={activeTab === "SETUP"} onClick={() => handleNavClick("SETUP")} />
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 border-r border-purple-800 flex flex-col overflow-hidden bg-gray-900">
          <div className="flex text-xs bg-gray-800 border-t border-b border-gray-700">
            <TabButton label="Quick" active={activeTabButton === "Quick"} onClick={() => handleTabButtonClick("Quick")} />
            <TabButton label="Actions" active={activeTabButton === "Actions"} onClick={() => handleTabButtonClick("Actions")} />
          </div>
          {activeTabButton === "Actions" ? (
            <div className="flex-1 p-4 overflow-auto">
              <ActionButton icon={<Plane size={24} />} label="TAKEOFF" onClick={handleTakeoff} color="bg-green-600" />
              <ActionButton icon={<Home size={24} />} label="RETURN HOME" onClick={handleReturnHome} color="bg-yellow-600" />
            </div>
          ) : (
            <div className="flex-1 bg-gray-900 p-4 overflow-auto">
              <TelemetryItem label="ALTITUDE (m)" value={droneData.altitude.toFixed(2)} color="text-purple-400" />
            </div>
          )}
        </div>
        <div className="w-2/3 bg-gray-900 flex flex-col">
          {activeTab === "PLAN" ? (
            <DroneMap dronePosition={[28.6139, 77.209]} droneData={droneData} batteryLevel={75} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <h1 className="text-4xl font-bold text-center text-purple-300">DIVYALINK DRONE CONTROL SYSTEM</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
