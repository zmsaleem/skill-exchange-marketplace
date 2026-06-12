import './ReviewCard.css';
import StarRating from '../StarRating/StarRating';
import { formatRelativeDate } from '../../utils/formatDate';

const ReviewCard = ({ review }) => (
  <div className="review-card">
    <div className="review-header">
      <div className="reviewer-info">
        <div className="reviewer-avatar">
          {review.reviewer?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="reviewer-name">{review.reviewer?.name || 'Anonymous'}</p>
          <p className="review-date">{formatRelativeDate(review.createdAt)}</p>
        </div>
      </div>
      <StarRating rating={review.rating} readOnly />
    </div>
    {review.comment && <p className="review-comment">{review.comment}</p>}
  </div>
);

export default ReviewCard;
