import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="flex justify-center w-full px-4">
      <div className="bg-gradient-to-b from-[#e0ebff] to-[#f4f7ff] p-6 rounded-2xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-[#2a344c] to-[#222630] text-white rounded-xl p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Container;
