import React from "react";

// Royal Blue - Premium blue gradient with gold accent
const ElegantLogo = ({ className = "h-12 w-auto" }: { className?: string }) => {
  return (
    <div className={`${className}`}>
      <div className="relative inline-flex items-center">
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-500 px-2 py-1 rounded-xl shadow-xl border border-blue-600">
          <span className="text-xl font-bold text-white tracking-tight">
            JobBoard
            <span className="text-yellow-400 text-3xl leading-none">.</span>
          </span>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
      </div>
    </div>
  );
};

export default ElegantLogo;
