import React from 'react';
    import { Star } from 'lucide-react';
    import { cn } from '@/lib/utils';

    const StarRating = ({ currentRating, onRatingChange, maxStars = 5, size = 32, className }) => {
      return (
        <div className={cn("flex space-x-1", className)}>
          {[...Array(maxStars)].map((_, index) => {
            const starValue = index + 1;
            return (
              <Star
                key={starValue}
                size={size}
                className={cn(
                  "cursor-pointer transition-colors",
                  starValue <= currentRating ? "text-yellow-400 fill-yellow-400" : "text-gray-500 hover:text-yellow-300"
                )}
                onClick={() => onRatingChange(starValue)}
              />
            );
          })}
        </div>
      );
    };

    export default StarRating;