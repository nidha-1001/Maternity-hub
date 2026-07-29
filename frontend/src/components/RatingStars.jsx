import { Star } from "lucide-react";

export const RatingStars = ({ rating = 5, showCount = false, totalReviews = 0 }) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= Math.round(rating) ? "fill-current" : "text-slate-300"}`}
          />
        ))}
      </div>
      <span className="text-sm font-bold text-slate-700 ml-1">{rating.toFixed(1)}</span>
      {showCount && <span className="text-sm text-slate-500 ml-1">({totalReviews} reviews)</span>}
    </div>
  );
};
