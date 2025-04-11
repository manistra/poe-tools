import React from "react";

interface DamageStatProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

const DamageStat: React.FC<DamageStatProps> = ({
  label,
  children,
  className = "",
}) => {
  return (
    <h3
      className={`mb-1 font-medium flex flex-row w-full justify-between text-white border-b border-dotted border-gray-700 ${className}`}
    >
      <span className="text-gray-400 text-sm">{label}:</span>
      <span>{children}</span>
    </h3>
  );
};

export default DamageStat;
