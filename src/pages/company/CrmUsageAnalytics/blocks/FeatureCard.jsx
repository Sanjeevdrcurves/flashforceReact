import React from "react";

const FeatureCard = ({ title, subtitle }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 text-center w-48">
      <h3 className="text-sm font-semibold text-gray-900">{subtitle}</h3>
      <p className="text-xs text-gray-500 mt-1 w-40">{title}</p>
    </div>
  );
};

export default FeatureCard;


