"use client";

import React from "react";

const Stepper: React.FC<{ steps: string[]; active: number }> = ({
  steps,
  active,
}) => {
  return (
    <div className="flex justify-center items-center gap-6 mb-6">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-medium text-sm
              ${
                i === active
                  ? "bg-gradient-to-r from-[#2a344c] to-[#222630] text-white"
                  : i < active
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
          >
            {i + 1}
          </div>
          <div
            className={`text-sm ${
              i === active ? "text-[#2a344c]" : "text-gray-600"
            }`}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
