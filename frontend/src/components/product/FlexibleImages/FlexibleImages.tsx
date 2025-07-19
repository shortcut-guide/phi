import React, { useState, useEffect } from "react";
import ImageSlider from "./ImageSlider";

type FlexibleImagesProps = {
  images: any;
};

const FlexibleImages: React.FC<FlexibleImagesProps> = ({ images }) => {
  if (Array.isArray(images)) {
    return <ImageSlider images={images} />;
  }
  if (typeof images === "object" && images !== null) {
    const parentKeys = Object.keys(images);
    const [activeParent, setActiveParent] = useState(parentKeys[0]);
    const [activeChild, setActiveChild] = useState(Object.keys(images[activeParent])[0]);
    useEffect(() => {
      setActiveChild(Object.keys(images[activeParent])[0]);
    }, [activeParent]);
    const childKeys = Object.keys(images[activeParent]);
    const activeImages = Array.isArray(images[activeParent][activeChild])
      ? images[activeParent][activeChild]
      : [];
    return (
      <div>
        <ImageSlider images={activeImages} />
        <div className="flex gap-2 mt-1 overflow-x-auto whitespace-nowrap scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {childKeys.map((child) => (
            <button
              key={child}
              className={`inline-block min-w-fit px-2 text-black text-[0.6875em] ${child === activeChild ? "bg-blue-400 text-white" : "bg-gray-100"}`}
              onClick={e => {
                e.stopPropagation();
                setActiveChild(child);
              }}
              type="button"
            >
              {child}
            </button>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default FlexibleImages;
