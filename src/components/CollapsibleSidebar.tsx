import React, { useState } from "react";
import ControlPanel from "./ControlPanel.tsx";

const CollapsibleSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <div
        className={`fixed w-[20rem] left-0 top-0 h-full overflow-y-auto bg-white/95 backdrop-blur-xl shadow-2xl border-r border-white/30 transition-transform duration-300 ease-in-out z-20 ${
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        {/* <div className="p-6 border-b border-gray-200/50">
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Controls
          </h2>
        </div> */}
        <ControlPanel />
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-6 z-50 bg-white/95 backdrop-blur-xl shadow-lg border border-white/30 rounded-full p-3 transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 ${
          isCollapsed ? "left-6" : "left-[21rem]"
        }`}
        title={isCollapsed ? "Open controls" : "Close controls"}
      >
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
            isCollapsed ? "rotate-0" : "rotate-180"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default CollapsibleSidebar;
