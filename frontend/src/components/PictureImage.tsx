import React from "react";

interface Props {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

const Picture = ({ src, alt, width, height, className }: Props) => {

  return (
    <picture>
      <source srcSet={`${src}.webp`} type="image/webp" />
      <source srcSet={`${src}.png`} type="image/png" />
      <img
        src={`${src}.png`}
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
