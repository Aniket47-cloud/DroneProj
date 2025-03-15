import { useState, useEffect } from "react";
import {
  Database,
  Globe,
  Settings,
  Sliders,
  PlayCircle,
  HelpCircle,
  Plane,
  Home,
  Play,
  ArrowUp,
  MapPin,
  Compass,
} from "lucide-react";
import DroneMap from "./DroneMap";
import NavButton from "./NavButton";
import ActionButton from "./ActionButton";
import TabButton from "./TabButton";
import TelemetryItem from "./TelemetryItem";
import React from "react";

export default function DivyalinkInterface({
  logs,
  telemetry,
  land,
  takeoff,
  changeAltitude,
}) {
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
  const handleNavClick = (tabName) => {
    setActiveTab(tabName);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  // Handle tab button clicks
  const handleTabButtonClick = (tabName) => {
    setActiveTabButton(tabName);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  // Toggle arm/disarm
  const toggleArmed = () => {
    setIsArmed(!isArmed);
    setStatusMessage(
      isArmed
        ? "Drone disarmed successfully."
        : "Drone armed successfully. Ready for flight."
    );
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
    setStatusMessage(
      flyHereMode
        ? "Fly Here mode deactivated."
        : "Fly Here mode activated. Click on map to set destination."
    );
    setTimeout(() => setStatusMessage(""), 3000);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white select-none">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center bg-gradient-to-r from-purple-900 to-indigo-900 p-2 shadow-xl">
        <div className="flex space-x-1">
          <NavButton
            icon={<Database size={18} />}
            label="DATA"
            active={activeTab === "DATA"}
            onClick={() => handleNavClick("DATA")}
          />
          <NavButton
            icon={<Globe size={18} />}
            label="PLAN"
            active={activeTab === "PLAN"}
            onClick={() => handleNavClick("PLAN")}
          />
          <NavButton
            icon={<Settings size={18} />}
            label="SETUP"
            active={activeTab === "SETUP"}
            onClick={() => handleNavClick("SETUP")}
          />
          <NavButton
            icon={<Sliders size={18} />}
            label="CONFIG"
            active={activeTab === "CONFIG"}
            onClick={() => handleNavClick("CONFIG")}
          />
          <NavButton
            icon={<PlayCircle size={18} />}
            label="SIMULATION"
            active={activeTab === "SIMULATION"}
            onClick={() => handleNavClick("SIMULATION")}
          />
          <NavButton
            icon={<HelpCircle size={18} />}
            label="HELP"
            active={activeTab === "HELP"}
            onClick={() => handleNavClick("HELP")}
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-xl font-bold mr-4 text-white transform hover:scale-105 transition-transform">
            <span className="bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
              DIVYALINK
            </span>

            <span className="text-xs ml-2 bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent">
              by Vayunotics
            </span>
          </div>
          <div className="flex items-center space-x-3 bg-black/30 px-3 py-1 rounded-lg border border-purple-500/50">
            <select className="bg-transparent text-white text-xs focus:outline-none">
              <option>115200</option>
              <option>57600</option>
              <option>9600</option>
            </select>
            <div className="h-5 w-px bg-purple-500/50"></div>
            <div
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => setConnected(!connected)}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  connected ? "bg-green-400 shadow-glow" : "bg-red-400"
                } transition-all`}
              ></div>
              <span className="text-xs font-medium text-purple-100 group-hover:text-white transition-colors">
                {connected ? "LINKED" : "CONNECT"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Message Bar */}
      {statusMessage && (
        <div className="bg-gradient-to-r from-purple-800 to-indigo-800 p-2 text-center text-sm font-medium shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-center space-x-2">
            <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-purple-400/50 animate-progress"></div>
            </div>
            <span className="whitespace-nowrap">{statusMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/3 border-r border-purple-900/50 flex flex-col bg-gradient-to-b from-gray-900/80 to-gray-900">
          <div className="relative h-1/2 bg-gradient-to-b from-purple-900/50 to-indigo-900/50">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="relative w-64 h-64">
                {/* 3D Sphere Effect */}
                <div className="absolute inset-0 rounded-full transform rotate-45 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 shadow-inner-xl"></div>

                {/* Horizon Disk */}
                <div className="absolute inset-0 rounded-full overflow-hidden transform-gpu">
                  <div className="absolute inset-0 bg-gradient-to-b from-sky-600/50 to-amber-800/50 backdrop-blur-sm"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 to-amber-700/20"></div>
                  <div className="absolute inset-0 border-2 border-purple-400/20 rounded-full"></div>
                </div>

                {/* Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-1 bg-yellow-400/80 rounded-full shadow-md"></div>
                  <div className="h-16 w-1 bg-yellow-400/80 rounded-full shadow-md"></div>
                </div>

                {/* Pitch Lines */}
                <div className="absolute top-[40%] inset-x-0 h-px bg-white/20"></div>
                <div className="absolute top-[45%] inset-x-0 h-px bg-white/30"></div>
                <div className="absolute top-[55%] inset-x-0 h-px bg-white/30"></div>
                <div className="absolute top-[60%] inset-x-0 h-px bg-white/20"></div>

                {/* Status Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                  <div className="flex justify-between items-center px-4">
                    <div
                      className={`text-sm font-bold ${
                        isArmed ? "text-green-400" : "text-red-400"
                      } flex items-center space-x-2`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isArmed ? "bg-green-400" : "bg-red-400"
                        } shadow-glow`}
                      ></div>
                      <span>{isArmed ? "ARMED" : "DISARMED"}</span>
                    </div>
                    <div className="text-sm text-purple-300">
                      {telemetry.altitude}m
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Attitude Indicator */}
            {/*  <div className="relative h-1/2 bg-gradient-to-b from-purple-900 to-indigo-900 flex flex-col items-center">
                <div className="absolute top-0 left-0 right-0 flex justify-between px-4 py-2 bg-purple-900 bg-opacity-70">
                  <div className="text-xs" style={{ fontFamily: "'NASALIZATION', sans-serif" }}>
                    TIME: {currentTime}
                  </div>
                  <div className="text-xs" style={{ fontFamily: "'NASALIZATION', sans-serif" }}>
                    ALTITUDE: {droneData.altitude.toFixed(1)}m
                  </div>
                </div>*/}

            {/* Circular Attitude Indicator */}
            {/* <div className="relative w-48 h-48 mt-12">}
                  <div className="absolute inset-0 rounded-full border-2 border-purple-400 overflow-hidden">
                    {/* Sky and Ground */}
            {/*  <div className="absolute inset-0 flex flex-col">
                      <div className="h-1/2 bg-gradient-to-b from-blue-400 to-indigo-600"></div>
                      <div className="h-1/2 bg-gradient-to-b from-amber-600 to-amber-800"></div>
                    </div>*/}

            {/* Horizon Line */}
            {/* <div className="absolute top-1/2 left-0 right-0 h-1 bg-white"></div>}

                    {/* Pitch Lines */}
            {/* <div className="absolute top-[40%] left-0 right-0 h-px bg-white"></div>
                    <div className="absolute top-[45%] left-0 right-0 h-px bg-white"></div>
                    <div className="absolute top-[55%] left-0 right-0 h-px bg-white"></div>
                    <div className="absolute top-[60%] left-0 right-0 h-px bg-white"></div>*/}

            {/* Center Indicator */}
            {/*  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-yellow-400"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-16 bg-yellow-400"></div>}

                    {/* Arm Status */}
            {/* <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                      <div
                        className={`text-xl font-bold ${isArmed ? "text-green-400" : "text-red-400"}`}
                        style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                      >
                        {isArmed ? "ARMED" : "DISARMED"}
                      </div>
                    </div>
                  </div>
                </div>*/}

            {/* Status Text */}
            {/* <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 py-1 bg-purple-900 bg-opacity-80 text-xs">
                  <div
                    className={isArmed ? "text-green-400" : "text-red-400"}
                    style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                  >
                    {isArmed ? "READY TO FLY" : "NOT READY TO ARM"}
                  </div>
                  <div className="text-yellow-400" style={{ fontFamily: "'NASALIZATION', sans-serif" }}>
                    {connected ? "CONNECTED" : "DISCONNECTED"}
                  </div>
                </div>*/}
          </div>
          {/* Tab Navigation */}
          <div className="flex bg-gray-900 border-b border-purple-900/50">
            <TabButton
              label="Quick"
              active={activeTabButton === "Quick"}
              onClick={() => handleTabButtonClick("Quick")}
            />
            <TabButton
              label="Actions"
              active={activeTabButton === "Actions"}
              onClick={() => handleTabButtonClick("Actions")}
            />
            <TabButton
              label="Messages"
              active={activeTabButton === "Messages"}
              onClick={() => handleTabButtonClick("Messages")}
            />
            <TabButton
              label="FlightPlan"
              active={activeTabButton === "FlightPlan"}
              onClick={() => handleTabButtonClick("FlightPlan")}
            />
            <TabButton
              label="Status"
              active={activeTabButton === "Status"}
              onClick={() => handleTabButtonClick("Status")}
            />
          </div>

          {/* Content based on activeTabButton */}
          {activeTabButton === "Actions" ? (
            <div className="flex-1 p-4 space-y-6 overflow-auto">
              <div className="grid grid-cols-2 gap-4">
                <ActionButton
                   icon={<Plane className="transform hover:scale-110 transition-transform" size={24} />}
                  label="TAKEOFF"
                  onClick={takeoff}
                  color="bg-green-600"
                  className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
                />
                <ActionButton
                 icon={<Plane className="transform hover:scale-110 transition-transform" size={24} />}
                  label="LAND"
                  onClick={land}
                  color="bg-red-600"
                    className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <ActionButton
                 icon={<Plane className="transform hover:scale-110 transition-transform" size={24} />}
                  label="MISSION START"
                  onClick={handleMissionStart}
                  color="bg-blue-600"
                  className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
                />
                <ActionButton
                  icon={<Home className="transform hover:scale-110 transition-transform" size={24} />}
                  label="RETURN HOME"
                  onClick={handleReturnHome}
                  color="bg-yellow-600"
                  className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <ActionButton
                  icon={<ArrowUp className="transform hover:scale-110 transition-transform" size={24} />}
                  label="CHANGE ALTITUDE"
                  onClick={handleChangeAltitude}
                  color="bg-purple-600"
                  className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
                />
                <ActionButton
                  icon={<MapPin className="transform hover:scale-110 transition-transform" size={24} />}
                  label="FLY HERE"
                  onClick={toggleFlyHereMode}
                  color={flyHereMode ? "bg-pink-600" : "bg-purple-600"}
                  className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
                />
              </div>
            </div>
          ) : activeTabButton === "Messages" ? (
            // Messages Panel
            <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-900/80">
              <div
               className="bg-purple-900/50 p-3 text-center font-bold border-b border-purple-800/50 backdrop-blur-sm"
              >
                SYSTEM MESSAGES
              </div>
              <div className="p-4 space-y-2 flex-1 overflow-auto">
                {logs.map((log, index) => (
                  <div key={index} className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                    <div className="text-xs text-purple-400">{new Date().toLocaleTimeString()}</div>
                    <div className="text-sm">{log}</div>
                  </div>
                ))}
             
            
                  {/* <div className="p-2 bg-gray-700 rounded">
                    <div className="text-xs text-gray-400">12:34:56</div>
                    <div className="text-sm">System initialized successfully</div>
                  </div>
                  <div className="p-2 bg-gray-700 rounded">
                    <div className="text-xs text-gray-400">12:35:10</div>
                    <div className="text-sm">GPS signal acquired (8 satellites)</div>
                  </div>
                  <div className="p-2 bg-gray-700 rounded">
                    <div className="text-xs text-gray-400">12:35:45</div>
                    <div className="text-sm">Battery level: 95%</div>
                  </div>
                  <div className="p-2 bg-gray-700 rounded">
                    <div className="text-xs text-gray-400">12:36:12</div>
                    <div className="text-sm">Calibration complete</div>
                  </div>
                  <div className="p-2 bg-gray-700 rounded">
                    <div className="text-xs text-gray-400">12:37:30</div>
                    <div className="text-sm">Ready for flight operations</div>
                  </div>
                  <div className="p-2 bg-purple-700 rounded">
                    <div className="text-xs text-gray-400">12:38:05</div>
                    <div className="text-sm text-purple-200">No-fly zone detected nearby</div>
                  </div>*/}
                </div>
              </div>
              
            
          ) : activeTabButton === "FlightPlan" ? (
            // Flight Plan Panel
            <div className="flex flex-col h-full">
              <div
                className="bg-purple-900 p-3 text-center font-bold border-b border-purple-700"
                style={{ fontFamily: "'NASALIZATION', sans-serif" }}
              >
                FLIGHT PLAN EDITOR
              </div>
              <div className="p-4 flex-1 overflow-auto">
                <div className="mb-4">
                  <div
                    className="text-sm font-bold mb-2"
                    style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                  >
                    WAYPOINTS
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 bg-gray-800 rounded flex justify-between items-center">
                      <div>Waypoint 1</div>
                      <div className="text-xs text-gray-400">
                        28.6139, 77.2090
                      </div>
                    </div>
                    <div className="p-2 bg-gray-800 rounded flex justify-between items-center">
                      <div>Waypoint 2</div>
                      <div className="text-xs text-gray-400">
                        28.6150, 77.2100
                      </div>
                    </div>
                    <div className="p-2 bg-gray-800 rounded flex justify-between items-center">
                      <div>Waypoint 3</div>
                      <div className="text-xs text-gray-400">
                        28.6160, 77.2110
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div
                    className="text-sm font-bold mb-2"
                    style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                  >
                    MISSION PARAMETERS
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-gray-800 rounded">
                      <div className="text-xs text-gray-400">Altitude</div>
                      <div>50 meters</div>
                    </div>
                    <div className="p-2 bg-gray-800 rounded">
                      <div className="text-xs text-gray-400">Speed</div>
                      <div>15 m/s</div>
                    </div>
                    <div className="p-2 bg-gray-800 rounded">
                      <div className="text-xs text-gray-400">Mission Type</div>
                      <div>Survey</div>
                    </div>
                    <div className="p-2 bg-gray-800 rounded">
                      <div className="text-xs text-gray-400">Duration</div>
                      <div>~15 minutes</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md"
                    style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                    onClick={() => {
                      setStatusMessage("Flight plan saved successfully.");
                      setTimeout(() => setStatusMessage(""), 3000);
                    }}
                  >
                    SAVE FLIGHT PLAN
                  </button>
                </div>
              </div>
            </div>
          ) : activeTabButton === "Status" ? (
            // Status Panel
            <div className="flex flex-col h-full">
              <div
                className="bg-purple-900 p-3 text-center font-bold border-b border-purple-700"
                style={{ fontFamily: "'NASALIZATION', sans-serif" }}
              >
                SYSTEM STATUS
              </div>
              <div className="p-4 flex-1 overflow-auto">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <div
                      className="text-sm font-bold mb-2"
                      style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                    >
                      HARDWARE
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">CPU</span>
                        <span className="text-green-400">Normal (32%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Memory</span>
                        <span className="text-green-400">Normal (45%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Storage</span>
                        <span className="text-green-400">
                          Normal (12GB free)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Temperature</span>
                        <span className="text-yellow-400">Elevated (42°C)</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <div
                      className="text-sm font-bold mb-2"
                      style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                    >
                      SENSORS
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">GPS</span>
                        <span className="text-green-400">
                          Good (8 satellites)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">IMU</span>
                        <span className="text-green-400">Calibrated</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Barometer</span>
                        <span className="text-green-400">Normal</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Compass</span>
                        <span className="text-yellow-400">
                          Needs Calibration
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-gray-900 p-4 overflow-auto">
              <div className="grid grid-cols-2 gap-6">
                <TelemetryItem
                  label="ALTITUDE (m)"
                  value={telemetry.altitude || 0}
                  color="text-purple-400"
                />
                <TelemetryItem
                  label="GROUNDSPEED (m/s)"
                  value={telemetry.groundSpeed || 0}
                  color="text-blue-400"
                />
                <TelemetryItem
                  label="DIST TO WP (m)"
                  value="0.00"
                  color="text-violet-400"
                />
                <TelemetryItem
                  label="YAW (deg)"
                  value={telemetry.yaw}
                  color="text-yellow-400"
                />
                <TelemetryItem
                  label="VERTICAL SPEED (m/s)"
                  value={telemetry.verticalSpeed || 0}
                  color="text-orange-400"
                />
                <TelemetryItem
                  label="Latitude "
                  value={telemetry.latitude || 0 }
                  color="text-orange-400"
                />
                <TelemetryItem
                  label="Longitude "
                  value={telemetry.longitude || 0 }
                  color="text-orange-400"
                />
                <TelemetryItem
                  label="Heading"
                  value={telemetry.heading || 0}
                  color="text-red-400"
                />
              </div>

              {/* Arm/Disarm Button */}
              <div className="mt-6 flex justify-center">
                <button
                  className={`px-6 py-3 rounded-md font-bold ${
                    isArmed
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  } transition-colors`}
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
              connectionStatus={{
                baud: 115200,
                port: "COM4",
                status: connected ? "CONNECTED" : "DISCONNECTED",
              }}
            />
          ) : activeTab === "SETUP" ? (
            // Setup View
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="w-full max-w-3xl">
                <h2
                  className="text-2xl font-bold mb-6 text-purple-300 text-center"
                  style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                >
                  DRONE SETUP
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3
                      className="text-lg font-bold mb-4 text-purple-300"
                      style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                    >
                      FLIGHT PARAMETERS
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Maximum Altitude
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="500"
                          defaultValue="120"
                          className="w-full"
                          onChange={() => {
                            setStatusMessage("Maximum altitude updated.");
                            setTimeout(() => setStatusMessage(""), 3000);
                          }}
                        />
                        <div className="flex justify-between text-xs">
                          <span>10m</span>
                          <span>120m</span>
                          <span>500m</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Maximum Speed
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          defaultValue="10"
                          className="w-full"
                          onChange={() => {
                            setStatusMessage("Maximum speed updated.");
                            setTimeout(() => setStatusMessage(""), 3000);
                          }}
                        />
                        <div className="flex justify-between text-xs">
                          <span>1m/s</span>
                          <span>10m/s</span>
                          <span>20m/s</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Return Altitude
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="200"
                          defaultValue="50"
                          className="w-full"
                          onChange={() => {
                            setStatusMessage("Return altitude updated.");
                            setTimeout(() => setStatusMessage(""), 3000);
                          }}
                        />
                        <div className="flex justify-between text-xs">
                          <span>10m</span>
                          <span>50m</span>
                          <span>200m</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3
                      className="text-lg font-bold mb-4 text-purple-300"
                      style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                    >
                      SAFETY SETTINGS
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Geofencing</label>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-gray-700">
                          <input
                            type="checkbox"
                            className="sr-only"
                            defaultChecked
                            onChange={() => {
                              setStatusMessage("Geofencing toggled.");
                              setTimeout(() => setStatusMessage(""), 3000);
                            }}
                          />
                          <span className="block w-6 h-6 bg-purple-500 rounded-full transform translate-x-6"></span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm">Return on Low Battery</label>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-gray-700">
                          <input
                            type="checkbox"
                            className="sr-only"
                            defaultChecked
                            onChange={() => {
                              setStatusMessage(
                                "Return on low battery toggled."
                              );
                              setTimeout(() => setStatusMessage(""), 3000);
                            }}
                          />
                          <span className="block w-6 h-6 bg-purple-500 rounded-full transform translate-x-6"></span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm">Obstacle Avoidance</label>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-gray-700">
                          <input
                            type="checkbox"
                            className="sr-only"
                            defaultChecked
                            onChange={() => {
                              setStatusMessage("Obstacle avoidance toggled.");
                              setTimeout(() => setStatusMessage(""), 3000);
                            }}
                          />
                          <span className="block w-6 h-6 bg-purple-500 rounded-full transform translate-x-6"></span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Low Battery Threshold
                        </label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            min="10"
                            max="50"
                            defaultValue="20"
                            className="w-16 bg-gray-700 p-1 rounded"
                            onChange={() => {
                              setStatusMessage("Battery threshold updated.");
                              setTimeout(() => setStatusMessage(""), 3000);
                            }}
                          />
                          <span className="ml-2">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md font-bold"
                    style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                    onClick={() => {
                      setStatusMessage("Settings saved successfully.");
                      setTimeout(() => setStatusMessage(""), 3000);
                    }}
                  >
                    SAVE SETTINGS
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === "CONFIG" ? (
            // Config View
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="w-full max-w-3xl">
                <h2
                  className="text-2xl font-bold mb-6 text-purple-300 text-center"
                  style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                >
                  ADVANCED CONFIGURATION
                </h2>

                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3
                      className="text-lg font-bold mb-4 text-purple-300"
                      style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                    >
                      FLIGHT CONTROLLER
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">
                            PID Roll P
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            defaultValue="0.15"
                            className="w-full bg-gray-700 p-2 rounded"
                            onChange={() => {
                              setStatusMessage("PID Roll P updated.");
                              setTimeout(() => setStatusMessage(""), 3000);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">
                            PID Roll I
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            defaultValue="0.05"
                            className="w-full bg-gray-700 p-2 rounded"
                            onChange={() => {
                              setStatusMessage("PID Roll I updated.");
                              setTimeout(() => setStatusMessage(""), 3000);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">
                            PID Pitch P
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            defaultValue="0.15"
                            className="w-full bg-gray-700 p-2 rounded"
                            onChange={() => {
                              setStatusMessage("PID Pitch P updated.");
                              setTimeout(() => setStatusMessage(""), 3000);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">
                            PID Pitch I
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            defaultValue="0.05"
                            className="w-full bg-gray-700 p-2 rounded"
                            onChange={() => {
                              setStatusMessage("PID Pitch I updated.");
                              setTimeout(() => setStatusMessage(""), 3000);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3
                      className="text-lg font-bold mb-4 text-purple-300"
                      style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                    >
                      SENSOR CALIBRATION
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          className="bg-purple-600 hover:bg-purple-700 p-2 rounded"
                          onClick={() => {
                            setStatusMessage(
                              "Accelerometer calibration started. Keep drone level."
                            );
                            setTimeout(() => setStatusMessage(""), 3000);
                          }}
                        >
                          Calibrate Accelerometer
                        </button>
                        <button
                          className="bg-purple-600 hover:bg-purple-700 p-2 rounded"
                          onClick={() => {
                            setStatusMessage(
                              "Compass calibration started. Rotate drone in all axes."
                            );
                            setTimeout(() => setStatusMessage(""), 3000);
                          }}
                        >
                          Calibrate Compass
                        </button>
                        <button
                          className="bg-purple-600 hover:bg-purple-700 p-2 rounded"
                          onClick={() => {
                            setStatusMessage(
                              "ESC calibration started. Remove propellers first!"
                            );
                            setTimeout(() => setStatusMessage(""), 3000);
                          }}
                        >
                          Calibrate ESCs
                        </button>
                        <button
                          className="bg-purple-600 hover:bg-purple-700 p-2 rounded"
                          onClick={() => {
                            setStatusMessage(
                              "Radio calibration started. Move all sticks to extremes."
                            );
                            setTimeout(() => setStatusMessage(""), 3000);
                          }}
                        >
                          Calibrate Radio
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md font-bold"
                    style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                    onClick={() => {
                      setStatusMessage("Configuration saved successfully.");
                      setTimeout(() => setStatusMessage(""), 3000);
                    }}
                  >
                    SAVE CONFIGURATION
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === "SIMULATION" ? (
            // Simulation View
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="w-full max-w-3xl">
                <h2
                  className="text-2xl font-bold mb-6 text-purple-300 text-center"
                  style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                >
                  FLIGHT SIMULATION
                </h2>

                <div className="bg-gray-800 p-6 rounded-lg mb-6">
                  <p className="text-center mb-6">
                    Test your flight plans and drone configurations in a safe
                    simulated environment before real-world deployment.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3
                        className="text-lg font-bold text-purple-300"
                        style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                      >
                        ENVIRONMENT SETTINGS
                      </h3>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Wind Speed
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          defaultValue="5"
                          className="w-full"
                          onChange={() => {
                            setStatusMessage(
                              "Wind speed updated in simulation."
                            );
                            setTimeout(() => setStatusMessage(""), 3000);
                          }}
                        />
                        <div className="flex justify-between text-xs">
                          <span>0 m/s</span>
                          <span>5 m/s</span>
                          <span>20 m/s</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Wind Direction
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="359"
                          defaultValue="180"
                          className="w-full"
                          onChange={() => {
                            setStatusMessage(
                              "Wind direction updated in simulation."
                            );
                            setTimeout(() => setStatusMessage(""), 3000);
                          }}
                        />
                        <div className="flex justify-between text-xs">
                          <span>0°</span>
                          <span>180°</span>
                          <span>359°</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm">GPS Errors</label>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-gray-700">
                          <input
                            type="checkbox"
                            className="sr-only"
                            onChange={() => {
                              setStatusMessage(
                                "GPS errors toggled in simulation."
                              );
                              setTimeout(() => setStatusMessage(""), 3000);
                            }}
                          />
                          <span className="block w-6 h-6 bg-purple-500 rounded-full"></span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3
                        className="text-lg font-bold text-purple-300"
                        style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                      >
                        SIMULATION CONTROLS
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        <button
                          className="bg-green-600 hover:bg-green-700 p-3 rounded font-bold"
                          style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                          onClick={() => {
                            setStatusMessage("Simulation started.");
                            setTimeout(() => setStatusMessage(""), 3000);
                          }}
                        >
                          START
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 p-3 rounded font-bold"
                          style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                          onClick={() => {
                            setStatusMessage("Simulation stopped.");
                            setTimeout(() => setStatusMessage(""), 3000);
                          }}
                        >
                          STOP
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Simulation Speed
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="5"
                          step="0.5"
                          defaultValue="1"
                          className="w-full"
                          onChange={() => {
                            setStatusMessage("Simulation speed updated.");
                            setTimeout(() => setStatusMessage(""), 3000);
                          }}
                        />
                        <div className="flex justify-between text-xs">
                          <span>0.5x</span>
                          <span>1x</span>
                          <span>5x</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3
                    className="text-lg font-bold mb-4 text-purple-300 text-center"
                    style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                  >
                    SIMULATION RESULTS
                  </h3>

                  <div className="h-48 bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
                    <p className="text-gray-500">
                      Simulation data will appear here
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <button
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md font-bold"
                      style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                      onClick={() => {
                        setStatusMessage("Simulation report generated.");
                        setTimeout(() => setStatusMessage(""), 3000);
                      }}
                    >
                      GENERATE REPORT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "HELP" ? (
            // Help View
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="w-full max-w-3xl">
                <h2
                  className="text-2xl font-bold mb-6 text-purple-300 text-center"
                  style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                >
                  DIVYALINK HELP CENTER
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3
                      className="text-lg font-bold mb-4 text-purple-300"
                      style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                    >
                      QUICK START GUIDE
                    </h3>
                    <div className="space-y-3">
                      <div className="p-2 bg-gray-700 rounded">
                        <div className="font-bold">1. Connect Your Drone</div>
                        <p className="text-sm text-gray-300">
                          Use the CONNECT button in the top right to establish
                          connection with your drone.
                        </p>
                      </div>
                      <div className="p-2 bg-gray-700 rounded">
                        <div className="font-bold">2. Check Flight Status</div>
                        <p className="text-sm text-gray-300">
                          Verify all systems are green in the DATA tab before
                          proceeding.
                        </p>
                      </div>
                      <div className="p-2 bg-gray-700 rounded">
                        <div className="font-bold">3. Plan Your Mission</div>
                        <p className="text-sm text-gray-300">
                          Use the PLAN tab to set waypoints and configure your
                          flight path.
                        </p>
                      </div>
                      <div className="p-2 bg-gray-700 rounded">
                        <div className="font-bold">4. Arm and Fly</div>
                        <p className="text-sm text-gray-300">
                          Use the ARM button to prepare for takeoff, then use
                          TAKEOFF to begin your mission.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3
                      className="text-lg font-bold mb-4 text-purple-300"
                      style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                    >
                      SUPPORT RESOURCES
                    </h3>
                    <div className="space-y-3">
                      <div className="p-2 bg-gray-700 rounded">
                        <div className="font-bold">Documentation</div>
                        <p className="text-sm text-gray-300">
                          Access comprehensive user manuals and technical
                          documentation.
                        </p>
                        <button
                          className="mt-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                          onClick={() => {
                            setStatusMessage("Opening documentation...");
                            setTimeout(() => setStatusMessage(""), 3000);
                          }}
                        >
                          View Docs
                        </button>
                      </div>
                      <div className="p-2 bg-gray-700 rounded">
                        <div className="font-bold">Video Tutorials</div>
                        <p className="text-sm text-gray-300">
                          Watch step-by-step guides for common operations.
                        </p>
                        <button
                          className="mt-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                          onClick={() => {
                            setStatusMessage("Opening video tutorials...");
                            setTimeout(() => setStatusMessage(""), 3000);
                          }}
                        >
                          Watch Videos
                        </button>
                      </div>
                      <div className="p-2 bg-gray-700 rounded">
                        <div className="font-bold">Contact Support</div>
                        <p className="text-sm text-gray-300">
                          Get help from our technical support team.
                        </p>
                        <button
                          className="mt-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                          onClick={() => {
                            setStatusMessage("Opening support contact form...");
                            setTimeout(() => setStatusMessage(""), 3000);
                          }}
                        >
                          Contact Us
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-gray-800 p-4 rounded-lg">
                  <h3
                    className="text-lg font-bold mb-4 text-purple-300"
                    style={{ fontFamily: "'NASALIZATION', sans-serif" }}
                  >
                    FREQUENTLY ASKED QUESTIONS
                  </h3>
                  <div className="space-y-3">
                    <div className="p-2 bg-gray-700 rounded">
                      <div className="font-bold">
                        How do I calibrate my drone?
                      </div>
                      <p className="text-sm text-gray-300">
                        Navigate to the CONFIG tab and use the calibration
                        buttons under Sensor Calibration.
                      </p>
                    </div>
                    <div className="p-2 bg-gray-700 rounded">
                      <div className="font-bold">
                        What should I do if connection fails?
                      </div>
                      <p className="text-sm text-gray-300">
                        Check your USB connection, verify COM port settings, and
                        ensure your drone is powered on.
                      </p>
                    </div>
                    <div className="p-2 bg-gray-700 rounded">
                      <div className="font-bold">
                        How can I update firmware?
                      </div>
                      <p className="text-sm text-gray-300">
                        Use the SETUP tab and look for the Firmware Update
                        section to check for and install updates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
