import React from "react";
export default function TelemetryItem({ label, value, color }) {
    return (
      <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
        <div className="text-xs text-gray-400 mb-1" style={{ fontFamily: "'NASALIZATION', sans-serif" }}>
          {label}
        </div>
        <div className={`text-2xl font-mono ${color} font-bold`}>{value}</div>
      </div>
    );
  }