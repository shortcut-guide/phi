import React from "react";

type ChevronRightIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

const ChevronRightIcon: React.FC<ChevronRightIconProps> = ({
  className = "",
  width = 64,
  height = 20
}) => (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 64 32"
      className={`inline-block ${className}`}
      style={{ display: "block" }}
    >
      <rect
        x="2"
        y="2"
        width="60"
        height="28"
        rx="14"
        fill="rgba(0,0,0,0.5)"
      />
      <g>
        <path
          className="chevron-anim chevron1"
          d="M18 10l8 6-8 6"
          stroke="#fff"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  </>
);

export default ChevronRightIcon;