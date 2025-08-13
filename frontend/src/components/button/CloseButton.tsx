// frontend/src/components/common/CloseButton.tsx
import React from "react";

type Props = {
  label: string;
  onClick: () => void;
  className?: string;
};

const CloseButton: React.FC<Props> = ({ label, onClick, className }) => {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={
        className ??
        "absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      }
    >
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </button>
  );
};

export default CloseButton;