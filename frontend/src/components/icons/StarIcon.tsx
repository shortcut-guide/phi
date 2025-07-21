import React from "react";

type StarIconProps = {
  filled?: boolean;
  className?: string;
  size?: number;
};

const StarIcon: React.FC<StarIconProps> = ({
  filled = false,
  className = "",
  size = 14,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={filled ? "#facc15" : "none"}
    viewBox="0 0 24 24"
    stroke={filled ? "#facc15" : "#d1d5db"}
    strokeWidth={1.5}
    className={`inline-block ${className}`}
  >
    <polygon
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

export default StarIcon;
