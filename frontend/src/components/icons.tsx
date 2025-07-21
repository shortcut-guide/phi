import React from "react";

export const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    className={`lucide lucide-star w-3 h-3 ${filled ? "fill-orange-400" : "text-gray-300"}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

export const ReviewLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="lucide lucide-message-circle-code w-3 h-3"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 9.5 8 12l2 2.5" />
    <path d="m14 9.5 2 2.5-2 2.5" />
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
  </svg>
);

export const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="lucide lucide-chevron-right w-4 h-4 text-gray-500 pointer-events-none"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);