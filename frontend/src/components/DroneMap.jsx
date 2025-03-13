import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CameraView from "./CameraView";
import React from "react";
import { LuCompass } from "react-icons/lu";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const droneIcon = L.icon({
  iconUrl: "data:image/svg+xml;base64,...",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const homeIcon = L.icon({
  iconUrl: "data:image/svg+xml;base64,...",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export default function DroneMap({ dronePosition, droneData, batteryLevel, connectionStatus }) {
  const videoRef = useRef(null);
  const [flightPath, setFlightPath] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
          if (!dronePosition) {
            setFlightPath([[latitude, longitude]]);
          }
        },
        (error) => {
          console.error("Location error:", error);
          setLocationError("Could not get current location");
          setCurrentLocation([28.6139, 77.209]);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocationError("Geolocation not available");
      setCurrentLocation([28.6139, 77.209]);
    }
  }, []);

  useEffect(() => {
    if (dronePosition) {
      setFlightPath((prev) => (prev.length > 100 ? [...prev.slice(-99), dronePosition] : [...prev, dronePosition]));
    }
  }, [dronePosition]);

  if (!currentLocation) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-white">
        <div className="animate-spin mr-2">
          <LuCompass size={24} />
        </div>
        <span style={{ fontFamily: "'NASALIZATION', sans-serif" }}>LOADING LOCATION...</span>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-gray-900 overflow-hidden">
      {/* Camera View Positioned at Top-Right ABOVE Map */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50 w-[320px] h-[240px] shadow-lg rounded-lg border-2 border-purple-500">
        <CameraView droneData={droneData} videoRef={videoRef} />
      </div>

      {/* Map Container */}
      <MapContainer center={currentLocation} zoom={16} style={{ height: "calc(100vh - 250px)", marginTop: "250px", background: "#f0f0f0" }} zoomControl={false} ref={mapRef}>
        <MapUpdater center={currentLocation} zoom={16} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="&copy; Esri" />
        {flightPath.length > 1 && <Polyline positions={flightPath} color="#9333ea" weight={3} opacity={0.8} dashArray="5, 10" />}
        <Marker position={currentLocation} icon={homeIcon}>
          <Popup>
            <div className="text-center">
              <strong>Your Location</strong>
              <br />
              {currentLocation[0].toFixed(6)}, {currentLocation[1].toFixed(6)}
            </div>
          </Popup>
        </Marker>
        {dronePosition && (
          <Marker position={dronePosition} icon={droneIcon}>
            <Popup>
              <div className="text-center">
                <strong>Drone Position</strong>
                <br />
                Altitude: {droneData?.altitude?.toFixed(1)}m<br />
                Speed: {droneData?.groundSpeed?.toFixed(1)} km/h
                <br />
                Heading: {droneData?.yaw?.toFixed(1)}°
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Location Error Message */}
      {locationError && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 bg-opacity-90 text-white p-3 rounded-md z-10">
          {locationError}
        </div>
      )}
    </div>
  );
}
