import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mt-20 mb-6 px-3 text-center">
      <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">{title}</h2>
      <p className="sm:text-md mt-2 text-sm text-gray-600">{subtitle}</p>
    </div>
  );
};

export default SectionHeader;
