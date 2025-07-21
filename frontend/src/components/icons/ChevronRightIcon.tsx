import React from "react";

type ChevronRightIconProps = {
  className?: string;
  size?: number;
};

const ChevronRightIcon: React.FC<ChevronRightIconProps> = ({
  className = "",
  size = 20,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    stroke="#60a5fa"
    strokeWidth={2}
    className={`inline-block ${className}`}
  >
    <path
      d="M9 6l6 6-6 6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ChevronRightIcon;
