import React from "react";

// Royal Blue - Premium blue gradient with gold accent
const ElegantLogo = ({ className = "h-12 w-auto" }: { className?: string }) => {
  return (
    <div className={`${className}`}>
      <div className="relative inline-flex items-center">
        <div className="bg-white px-2 py-1 rounded-xl shadow-lg ">
          <span className="text-xl font-bold text-black tracking-tight">
            JobBoard
            <span className="text-yellow-400 text-3xl leading-none">.</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ElegantLogo;
