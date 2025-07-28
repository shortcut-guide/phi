import React from "react";
import StarIcon from "@/f/components/icons/StarIcon";
import ReviewLinkIcon from "@/f/components/icons/ReviewLinkIcon";
import { messages } from "@/f/config/messageConfig";

type Props = {
  rate?: number;
  count?: number;
  reviewLink?: string;
  url?: string;
  className?: string;
  lang?: string;
};

const ProductCardReview: React.FC<Props> = ({
  rate,
  count,
  reviewLink,
  url,
  className = "",
  lang
}) => {
  const productSpec = messages.productSpec?.[lang] ?? {};
  if (typeof rate !== "number" || typeof count !== "number") return null;
  return (
    <div className={`flex items-center text-[0.625em] text-gray-500 ${className}`}>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} filled={i < Math.floor(rate)} />
        ))}
        <span className="ml-1">({count.toLocaleString()})</span>
      </div>
      {reviewLink && (
        <a
          href={reviewLink.startsWith("http") ? reviewLink : `${url}${reviewLink}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 ml-2"
          aria-label={productSpec.review_look}
          onClick={(e) => e.stopPropagation()}
        >
          <ReviewLinkIcon />
        </a>
      )}
    </div>
  );
};

export default ProductCardReview;
