import { useState } from 'react';
import './StarRating.css';

const StarRating = ({ rating = 0, onRate, readOnly = false, size = 'md' }) => {
  const [hover, setHover] = useState(0);
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`star-rating star-${size}`} role="group" aria-label="Star rating">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${star <= (hover || rating) ? 'star-filled' : 'star-empty'}`}
          onClick={() => !readOnly && onRate && onRate(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          disabled={readOnly}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;
