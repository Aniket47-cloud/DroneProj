import React from "react";
export default function NavButton({ icon, label, active = false, onClick }) {
    return (
      <button
        className={`flex flex-col items-center justify-center ${active ? "bg-purple-700 border-b-2 border-purple-400" : "bg-purple-800 hover:bg-purple-700"} p-2 rounded-t transition-all duration-200`}
        onClick={onClick}
      >
        <div>{icon}</div>
        <div className="text-[10px] mt-1 font-medium" style={{ fontFamily: "'NASALIZATION', sans-serif" }}>
          {label}
        </div>
      </button>
    );
  }