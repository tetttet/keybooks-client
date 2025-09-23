import React from "react";

const Header = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <div className="-ml-6 lg:-ml-0">
      <h2 className="text-3xl max-w-xs lg:max-w-lg text-left lg:text-center lg:mx-auto">
        {title}
      </h2>
      <p className="text-gray-600 text-sm mt-2 max-w-xs lg:max-w-lg text-left lg:text-center lg:mx-auto">
        {subtitle}
      </p>
    </div>
  );
};

export default Header;
