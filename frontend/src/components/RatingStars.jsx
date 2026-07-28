import React from "react";
import { Star } from "lucide-react";

export const RatingStars = ({ rating = 5, showCount = true, totalReviews = 0 }) => {
  const numericRating = Number(rating) || 5;

  return (
    <div className="flex items-center gap-1.5 text-amber-400">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(numericRating)
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300 dark:text-slate-600"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
        {numericRating.toFixed(1)}
      </span>
      {showCount && totalReviews > 0 && (
        <span className="text-xs text-slate-400">({totalReviews})</span>
      )}
    </div>
  );
};
