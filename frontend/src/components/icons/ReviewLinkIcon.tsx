import React from "react";

type ReviewLinkIconProps = {
  className?: string;
  size?: number;
};

const ReviewLinkIcon: React.FC<ReviewLinkIconProps> = ({
  className = "",
  size = 16,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    stroke="#3b82f6"
    strokeWidth={2}
    className={`inline-block ${className}`}
  >
    <path
      d="M8 12l2 2 4-4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="#3b82f6"
      strokeWidth={2}
      fill="none"
    />
  </svg>
);

export default ReviewLinkIcon;
