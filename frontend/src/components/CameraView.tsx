import { useState, useEffect } from "react";
import React from "react";

export default function CameraView({ droneData, videoRef }) {
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          const tracks = stream.getVideoTracks();
          const settings = tracks[0].getSettings();
          if (settings.facingMode) {
            videoRef.current.style.transform = settings.facingMode === "user" ? "scaleX(-1)" : "scaleX(1)";
          } else {
            videoRef.current.style.transform = "scaleX(-1)";
          }
        }
      } catch (error) {
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } }});
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            videoRef.current.style.transform = "scaleX(-1)";
            const tracks = fallbackStream.getVideoTracks();
            const settings = tracks[0].getSettings();
            if (settings.facingMode === "environment") {
              videoRef.current.style.transform = "scaleX(1)";
            }
          }
        } catch (fallbackError) {
          console.error("Camera error:", fallbackError);
          setCameraError("Camera not available");
        }
      }
    }

    setupCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="absolute bottom-5 right-5 w-[400px] h-[300px] bg-black border-2 border-purple-500 rounded-lg z-20 overflow-hidden shadow-lg">
      <div className="p-2 bg-purple-900 text-white text-xs flex justify-between items-center">
        <span className="font-medium" style={{ fontFamily: "'NASALIZATION', sans-serif" }}>
          LIVE CAMERA FEED
        </span>
        <span className={cameraError ? "text-red-400" : "text-green-400"}>{cameraError ? "● ERROR" : "● LIVE"}</span>
      </div>
      <video ref={videoRef} className="w-full h-[calc(100%-35px)] object-cover block" autoPlay playsInline muted />
      <div className="absolute top-[35px] left-0 right-0 bottom-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] border-2 border-purple-500 rounded-full opacity-50" />
        <div className="absolute top-3 left-3 right-3 grid grid-cols-2 gap-2 text-white text-sm font-bold" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}>
          <div>ALT: {droneData?.altitude?.toFixed(1)}m</div>
          <div>SPD: {droneData?.groundSpeed?.toFixed(1)} km/h</div>
          <div>VS: {droneData?.verticalSpeed?.toFixed(1)} m/s</div>
          <div>HDG: {droneData?.yaw?.toFixed(1)}°</div>
        </div>
      </div>
      {cameraError && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-400 text-center bg-black bg-opacity-70 p-3 rounded">
          {cameraError}
        </div>
      )}
    </div>
  );
}
