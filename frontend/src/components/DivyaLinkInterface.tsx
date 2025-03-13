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

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      const time = date.toLocaleTimeString();
      setCurrentTime(time);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle navigation button clicks
  const handleNavClick = (tabName: string) => {
    setActiveTab(tabName);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  // Handle tab button clicks
  const handleTabButtonClick = (tabName: string) => {
    setActiveTabButton(tabName);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  // Toggle arm/disarm
  const toggleArmed = () => {
    setIsArmed(!isArmed);
    setStatusMessage(isArmed ? "Drone disarmed successfully." : "Drone armed successfully. Ready for flight.");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  // Handle action buttons
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
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center bg-purple-900 p-2 shadow-md">
        <div className="flex space-x-2">
          <NavButton icon={<Database size={18} />} label="DATA" active={activeTab === "DATA"} onClick={() => handleNavClick("DATA")} />
          <NavButton icon={<Globe size={18} />} label="PLAN" active={activeTab === "PLAN"} onClick={() => handleNavClick("PLAN")} />
          <NavButton icon={<Settings size={18} />} label="SETUP" active={activeTab === "SETUP"} onClick={() => handleNavClick("SETUP")} />
          <NavButton icon={<Sliders size={18} />} label="CONFIG" active={activeTab === "CONFIG"} onClick={() => handleNavClick("CONFIG")} />
          <NavButton icon={<PlayCircle size={18} />} label="SIMULATION" active={activeTab === "SIMULATION"} onClick={() => handleNavClick("SIMULATION")} />
          <NavButton icon={<HelpCircle size={18} />} label="HELP" active={activeTab === "HELP"} onClick={() => handleNavClick("HELP")} />
        </div>
        <div className="flex items-center">
          <div className="text-xl font-bold mr-4 text-white" style={{ fontFamily: "'NASALIZATION', sans-serif" }}>
            <span className="text-purple-300">DIVYA</span>
            <span className="text-white">LINK</span>
            <span className="text-xs ml-1 text-gray-300">by Vayunotics</span>
          </div>
          <select className="bg-purple-800 text-white text-xs p-1 mr-2 rounded border border-purple-600">
            <option>115200</option>
            <option>57600</option>
            <option>9600</option>
          </select>
          <div
            className="flex items-center bg-purple-800 px-3 py-1 rounded mr-2 cursor-pointer hover:bg-purple-700 transition-colors"
            onClick={() => setConnected(!connected)}
          >
            <div className={`w-3 h-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"} mr-2`}></div>
            <span className="text-xs font-medium">{connected ? "CONNECTED" : "CONNECT"}</span>
          </div>
        </div>
      </div>

      {/* Status Message Bar */}
      {statusMessage && (
        <div className="bg-purple-800 text-white p-2 text-center" style={{ fontFamily: "'NASALIZATION', sans-serif" }}>
          {statusMessage}
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/3 border-r border-purple-800 flex flex-col overflow-hidden bg-gray-900">
          {/* Tab Navigation */}
          <div className="flex text-xs bg-gray-800 border-t border-b border-gray-700">
            <TabButton label="Quick" active={activeTabButton === "Quick"} onClick={() => handleTabButtonClick("Quick")} />
            <TabButton label="Actions" active={activeTabButton === "Actions"} onClick={() => handleTabButtonClick("Actions")} />
            <TabButton label="Messages" active={activeTabButton === "Messages"} onClick={() => handleTabButtonClick("Messages")} />
            <TabButton label="FlightPlan" active={activeTabButton === "FlightPlan"} onClick={() => handleTabButtonClick("FlightPlan")} />
            <TabButton label="Status" active={activeTabButton === "Status"} onClick={() => handleTabButtonClick("Status")} />
          </div>

          {/* Content based on activeTabButton */}
          {activeTabButton === "Actions" ? (
            <div className="flex-1 p-4 overflow-auto">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <ActionButton
                  icon={<Plane size={24} />}
                  label="TAKEOFF"
                  onClick={handleTakeoff}
                  color="bg-green-600"
                />
                <ActionButton
                  icon={<Plane className="transform rotate-180" size={24} />}
                  label="LAND"
                  onClick={handleLand}
                  color="bg-red-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <ActionButton
                  icon={<Play size={24} />}
                  label="MISSION START"
                  onClick={handleMissionStart}
                  color="bg-blue-600"
                />
                <ActionButton
                  icon={<Home size={24} />}
                  label="RETURN HOME"
                  onClick={handleReturnHome}
                  color="bg-yellow-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <ActionButton
                  icon={<ArrowUp size={24} />}
                  label="CHANGE ALTITUDE"
                  onClick={handleChangeAltitude}
                  color="bg-purple-600"
                />
                <ActionButton
                  icon={<MapPin size={24} />}
                  label="FLY HERE"
                  onClick={toggleFlyHereMode}
                  color={flyHereMode ? "bg-pink-600" : "bg-purple-600"}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-gray-900 p-4 overflow-auto">
              <div className="grid grid-cols-2 gap-6">
                <TelemetryItem label="ALTITUDE (m)" value={droneData.altitude.toFixed(2)} color="text-purple-400" />
                <TelemetryItem label="GROUNDSPEED (m/s)" value={droneData.groundSpeed.toFixed(2)} color="text-blue-400" />
                <TelemetryItem label="DIST TO WP (m)" value="0.00" color="text-violet-400" />
                <TelemetryItem label="YAW (deg)" value={droneData.yaw.toFixed(2)} color="text-yellow-400" />
                <TelemetryItem label="VERTICAL SPEED (m/s)" value={droneData.verticalSpeed.toFixed(2)} color="text-orange-400" />
                <TelemetryItem label="DIST TO MAV" value="0.00" color="text-red-400" />
              </div>

              {/* Arm/Disarm Button */}
              <div className="mt-6 flex justify-center">
                <button
                  className={`px-6 py-3 rounded-md font-bold ${isArmed ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} transition-colors`}
                  onClick={toggleArmed}
                  style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                >
                  {isArmed ? "DISARM" : "ARM"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-2/3 bg-gray-900 flex flex-col">
          {activeTab === "PLAN" ? (
            <DroneMap
              dronePosition={[28.6139, 77.209]}
              droneData={droneData}
              batteryLevel={75}
              connectionStatus={{ baud: 115200, port: "COM4", status: connected ? "CONNECTED" : "DISCONNECTED" }}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="w-full h-full flex flex-col">
                <div className="h-1/6 border-b border-purple-700"></div>
                <div className="flex-1 flex items-center justify-center">
                  <h1
                    className="text-4xl font-bold text-center text-purple-300"
                    style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                  >
                    DIVYALINK
                    <br />
                    DRONE CONTROL SYSTEM
                    <br />
                    <span className="text-xl text-gray-400">by Vayunotics</span>
                  </h1>
                </div>
                <div className="h-1/6 border-t border-purple-700"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}