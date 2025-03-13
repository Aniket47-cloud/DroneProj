import React from "react";

interface TabButtonProps {
    label: string;
    active: boolean;
    onClick: () => void;
  }
  
  export default function TabButton({ label, active, onClick }: TabButtonProps) {
    return (
      <button
        className={`px-3 py-1 ${
          active ? "bg-purple-700 border-l-2 border-purple-400" : "bg-gray-800 hover:bg-gray-700"
        } transition-colors`}
        style={{ fontFamily: "'NASALIZATION', sans-serif" }}
        onClick={onClick}
      >
        {label}
      </button>
    );
  }