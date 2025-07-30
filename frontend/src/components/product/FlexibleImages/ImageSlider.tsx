import React, { useRef, useState } from "react";
import ChevronRightIcon from "@/f/components/icons/ChevronRightIcon";

type ImageSliderProps = {
  images: string[];
};

const isVideo = (src: string) =>
  /\.(mp4|webm|mov|ogg|m4v|avi)(\?.*)?$/i.test(src);

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleVideoClick = (idx: number) => {
    if (playingIndex === idx) {
      videoRefs.current[idx]?.pause();
      setPlayingIndex(null);
    } else {
      // 他の動画が再生中なら停止
      if (playingIndex !== null) {
        videoRefs.current[playingIndex]?.pause();
        videoRefs.current[playingIndex]?.currentTime && (videoRefs.current[playingIndex]!.currentTime = 0);
      }
      videoRefs.current[idx]?.play();
      setPlayingIndex(idx);
    }
  };

  return !images?.length ? null : (
    <div className="overflow-hidden w-full py-2">
      <div
        className="relative flex flex-nowrap overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((src, i) =>
          isVideo(src) ? (
            <div
              key={i}
              className="relative object-contain rounded-lg bg-gray-50 snap-center min-w-full max-w-full transition-transform duration-500"
              style={{
                aspectRatio: "1/1", // ここを好みで 1/1, 16/9, 4/3 などに
                width: "100%",
                cursor: "pointer",
                overflow: "hidden"
              }}
              onClick={() => handleVideoClick(i)}
            >
              <video
                ref={el => {
                  videoRefs.current[i] = el;
                }}
                src={src.startsWith("//") ? "https:" + src : src}
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  pointerEvents: "none"
                }}
                preload="metadata"
                playsInline
                tabIndex={-1}
              />
              {playingIndex !== i && (
                <div
                  style={{
                    position: "absolute",
                    top: "0.5rem",
                    left: "0.5rem",
                    width: 24,
                    height: 24,
                    zIndex: 2,
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* 再生アイコン 左上 corner 小さく */}
                  <svg width={24} height={24} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.5)" />
                    <polygon points="9,7 17,12 9,17" fill="#fff" />
                  </svg>
                </div>
              )}
            </div>
          ) : (
            <img
              key={i}
              src={src}
              alt=""
              className="object-contain rounded-lg bg-gray-50 snap-center min-w-full max-w-full transition-transform duration-500 hover:scale-105"
              style={{ width: "100%" }}
              draggable={false}
            />
          )
        )}
        <div className="absolute bottom-1 right-1 p-0.5 pointer-events-none">
          <ChevronRightIcon width={64} height={20} />
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;