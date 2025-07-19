import React from "react";
import ChevronRightIcon from "@/f/components/icons/ChevronRightIcon";

type ImageSliderProps = {
  images: string[];
};

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) =>
  !images?.length ? null : (
    <div className="overflow-hidden w-full py-2">
      <div
        className="relative flex flex-nowrap overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            className="object-contain rounded-lg bg-gray-50 snap-center min-w-full max-w-full transition-transform duration-500 hover:scale-105"
            style={{ height: "8rem" }}
            draggable={false}
          />
        ))}
        <div className="absolute bottom-1 right-1 bg-white bg-opacity-80 rounded-full p-0.5 pointer-events-none">
          <ChevronRightIcon />
        </div>
      </div>
    </div>
  );

export default ImageSlider;
