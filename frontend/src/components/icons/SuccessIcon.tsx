// frontend/src/components/common/SuccessIcon.tsx
import React from "react";

type Props = {
  className?: string;
  iconClassName?: string;
};

const SuccessIcon: React.FC<Props> = ({ className, iconClassName }) => {
  return (
    <div className={className ?? "flex h-10 w-10 items-center justify-center rounded-full bg-green-100"}>
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 24 24" className={iconClassName ?? "h-6 w-6 text-green-700"}>
        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export default SuccessIcon;