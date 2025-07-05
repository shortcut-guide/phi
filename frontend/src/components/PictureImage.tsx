import React from "react";

interface Props {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

const Picture: React.FC<Props> = ({ src, alt, width, height, className }) => {
  const baseName = src?.replace(/\.(webp|png|svg)$/i, '');

  return (
    <picture>
      <source srcSet={`${baseName}.webp`} type="image/webp" />
      <source srcSet={`${baseName}.png`} type="image/png" />
      <img
        src={`${baseName}.png`}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading="lazy"
      />
    </picture>
  );
};

export default Picture;
