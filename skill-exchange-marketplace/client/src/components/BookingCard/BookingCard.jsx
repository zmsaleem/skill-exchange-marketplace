import './BookingCard.css';
import { formatShortDate } from '../../utils/formatDate';

const statusConfig = {
  pending:   { label: 'Pending',   class: 'status-pending' },
  accepted:  { label: 'Accepted',  class: 'status-accepted' },
  rejected:  { label: 'Rejected',  class: 'status-rejected' },
  completed: { label: 'Completed', class: 'status-completed' },
};

const BookingCard = ({ booking, currentUserId, onStatusUpdate }) => {
  const isInstructor =
    booking.instructor?._id === currentUserId ||
    booking.instructor === currentUserId;
  const status = statusConfig[booking.status] || statusConfig.pending;
  const otherParty = isInstructor ? booking.learner : booking.instructor;

  return (
    <div className={`booking-card booking-card--${booking.status}`}>
      <div className="booking-card-header">
        <h4 className="booking-skill">{booking.skill?.title || 'Unknown Skill'}</h4>
        <span className={`status-badge ${status.class}`}>{status.label}</span>
      </div>
      <div className="booking-card-body">
        <p>
          <strong>{isInstructor ? 'Learner' : 'Instructor'}:</strong>{' '}
          {otherParty?.name || 'Unknown'}
        </p>
        <p>
          <strong>Date:</strong> {formatShortDate(booking.date)}
        </p>
        {booking.message && (
          <p>
            <strong>Message:</strong> {booking.message}
          </p>
        )}
      </div>

      {isInstructor && booking.status === 'pending' && onStatusUpdate && (
        <div className="booking-card-actions">
          <button
            className="btn-accept"
            onClick={() => onStatusUpdate(booking._id, 'accepted')}
          >
            Accept
          </button>
          <button
            className="btn-reject"
            onClick={() => onStatusUpdate(booking._id, 'rejected')}
          >
            Reject
          </button>
        </div>
      )}

      {isInstructor && booking.status === 'accepted' && onStatusUpdate && (
        <div className="booking-card-actions">
          <button
            className="btn-complete"
            onClick={() => onStatusUpdate(booking._id, 'completed')}
          >
            Mark Complete
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
