"use client";

import React from "react";

const Stepper: React.FC<{ steps: string[]; active: number }> = ({
  steps,
  active,
}) => {
  return (
    <div className="flex items-center gap-6 mb-6">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-medium text-sm
              ${
                i === active
                  ? "bg-blue-600 text-white"
                  : i < active
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
          >
            {i + 1}
          </div>
          <div
            className={`text-sm ${
              i === active ? "text-blue-600" : "text-gray-600"
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
