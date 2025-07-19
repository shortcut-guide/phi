import React from "react";

const DescriptionBlock: React.FC<{ text?: string }> = ({ text }) =>
  !text ? null : (
    <div className="mb-4">
      {text.split("\n").map((line, i) =>
        line.trim() ? (
          <div key={i} className="text-[0.6875em] font-bold text-black text-left mb-2 leading-tight">
            {line}
          </div>
        ) : (
          <div key={i} className="mb-2" />
        )
      )}
    </div>
  );

export default DescriptionBlock;
