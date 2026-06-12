import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/Loader/Loader';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import StarRating from '../../components/StarRating/StarRating';
import { getSkillById } from '../../api/skillApi';
import { createBooking, getMyBookings } from '../../api/bookingApi';
import { getSkillReviews, createReview } from '../../api/reviewApi';
import './SkillDetails.css';

const categoryColors = {
  Programming: '#4F46E5', Design: '#EC4899', Music: '#8B5CF6',
  Language: '#10B981', Business: '#F59E0B', Science: '#3B82F6', Other: '#6B7280',
};

const SkillDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [skill, setSkill] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({ date: '', message: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  const [hasCompletedBooking, setHasCompletedBooking] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [skillData, reviewsData] = await Promise.all([
        getSkillById(id),
        getSkillReviews(id),
      ]);
      setSkill(skillData);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);

      if (user) {
        try {
          const myBookings = await getMyBookings();
          const completed = (Array.isArray(myBookings) ? myBookings : []).some(
            (b) =>
              b.skill?._id === id &&
              b.status === 'completed' &&
              (b.learner?._id === user._id || b.learner === user._id)
          );
          setHasCompletedBooking(completed);
        } catch {
          // non-critical
        }
      }
    } catch (err) {
      if (err.response?.status === 404) setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.date) {
      setBookingError('Please select a date');
      return;
    }
    setBookingLoading(true);
    setBookingError('');
    try {
      await createBooking({
        skill: id,
        instructor: skill.instructor._id,
        date: bookingForm.date,
        message: bookingForm.message,
      });
      setBookingSuccess('Booking request sent successfully!');
      setShowBookingForm(false);
      setBookingForm({ date: '', message: '' });
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewForm.rating === 0) {
      setReviewError('Please select a rating');
      return;
    }
    setReviewLoading(true);
    setReviewError('');
    try {
      const newReview = await createReview({
        skill: id,
        instructor: skill.instructor._id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviews((prev) => [newReview, ...prev]);
      setReviewSuccess('Review submitted successfully!');
      setReviewForm({ rating: 0, comment: '' });
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  if (loading) return <Loader size="lg" text="Loading skill..." />;

  if (notFound) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Skill Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
          This skill doesn&apos;t exist or has been removed.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/browse')}>
          Browse Skills
        </button>
      </div>
    );
  }

  if (!skill) return null;

  const isOwner = user && (skill.instructor?._id === user._id || skill.instructor === user._id);
  const isLoggedIn = !!user;

  return (
    <div className="skill-details-page">
      <div className="container skill-details-container">
        {/* Main content */}
        <div className="skill-main">
          <div className="skill-details-card">
            <div className="skill-details-header">
              <span
                className="category-badge-lg"
                style={{ backgroundColor: categoryColors[skill.category] || '#6B7280' }}
              >
                {skill.category}
              </span>
              <h1 className="skill-details-title">{skill.title}</h1>
              {avgRating && (
                <div className="skill-rating-summary">
                  <StarRating rating={Math.round(parseFloat(avgRating))} readOnly size="sm" />
                  <span className="avg-rating">{avgRating}</span>
                  <span className="review-count">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                </div>
              )}
            </div>

            <div className="skill-details-meta">
              <span className="meta-tag">
                🕐 {skill.availability}
              </span>
            </div>

            <div className="skill-details-description">
              <h3>About this skill</h3>
              <p>{skill.description}</p>
            </div>

            {/* Booking */}
            {!isOwner && isLoggedIn && (
              <div className="booking-section">
                {bookingSuccess && (
                  <div className="alert alert-success">{bookingSuccess}</div>
                )}
                {!showBookingForm ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setShowBookingForm(true);
                      setBookingSuccess('');
                    }}
                  >
                    📅 Book a Session
                  </button>
                ) : (
                  <form className="booking-form" onSubmit={handleBookingSubmit}>
                    <h3 className="booking-form-title">Request a Session</h3>
                    {bookingError && <div className="alert alert-error">{bookingError}</div>}
                    <div className="form-group">
                      <label className="form-label" htmlFor="booking-date">Preferred Date</label>
                      <input
                        id="booking-date"
                        type="date"
                        className="form-input"
                        value={bookingForm.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) =>
                          setBookingForm((p) => ({ ...p, date: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="booking-message">Message (optional)</label>
                      <textarea
                        id="booking-message"
                        className="form-textarea"
                        rows={3}
                        placeholder="Tell the instructor what you'd like to learn..."
                        value={bookingForm.message}
                        onChange={(e) =>
                          setBookingForm((p) => ({ ...p, message: e.target.value }))
                        }
                      />
                    </div>
                    <div className="booking-form-actions">
                      <button type="submit" className="btn btn-primary" disabled={bookingLoading}>
                        {bookingLoading ? 'Sending...' : 'Send Request'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => setShowBookingForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {!isLoggedIn && (
              <div className="booking-prompt">
                <a href="/login" className="btn btn-primary">Login to Book a Session</a>
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="reviews-section">
            <h2 className="reviews-title">
              Reviews {reviews.length > 0 && <span className="reviews-count">({reviews.length})</span>}
            </h2>

            {/* Leave review */}
            {isLoggedIn && hasCompletedBooking && !isOwner && (
              <div className="leave-review-card">
                <h3>Leave a Review</h3>
                {reviewSuccess && <div className="alert alert-success">{reviewSuccess}</div>}
                {!reviewSuccess && (
                  <form onSubmit={handleReviewSubmit}>
                    {reviewError && <div className="alert alert-error">{reviewError}</div>}
                    <div className="form-group">
                      <label className="form-label">Your Rating</label>
                      <StarRating
                        rating={reviewForm.rating}
                        onRate={(r) => setReviewForm((p) => ({ ...p, rating: r }))}
                        size="lg"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="review-comment">Your Comment</label>
                      <textarea
                        id="review-comment"
                        className="form-textarea"
                        rows={3}
                        placeholder="Share your experience..."
                        value={reviewForm.comment}
                        onChange={(e) =>
                          setReviewForm((p) => ({ ...p, comment: e.target.value }))
                        }
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={reviewLoading}>
                      {reviewLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {reviews.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem 0' }}>
                <div className="empty-state-icon">⭐</div>
                <h3>No reviews yet</h3>
                <p>Be the first to review this skill!</p>
              </div>
            ) : (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="skill-sidebar">
          <div className="instructor-card">
            <h3 className="instructor-card-title">About the Instructor</h3>
            <div className="instructor-profile">
              <div className="instructor-avatar-lg">
                {skill.instructor?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="instructor-card-name">{skill.instructor?.name}</p>
                <p className="instructor-card-role">Instructor</p>
              </div>
            </div>
            {skill.instructor?.bio && (
              <p className="instructor-bio">{skill.instructor.bio}</p>
            )}
            {skill.instructor?.skillsToTeach?.length > 0 && (
              <div className="instructor-skills">
                <p className="instructor-skills-label">Also teaches:</p>
                <div className="instructor-skills-tags">
                  {skill.instructor.skillsToTeach.slice(0, 4).map((s, i) => (
                    <span key={i} className="instructor-skill-tag">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {isOwner && (
            <div className="owner-actions">
              <a href={`/skills/${id}/edit`} className="btn btn-outline" style={{ width: '100%', marginBottom: '0.5rem' }}>
                ✏️ Edit Skill
              </a>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default SkillDetails;
