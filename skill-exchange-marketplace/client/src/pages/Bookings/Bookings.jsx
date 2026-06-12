import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import BookingCard from '../../components/BookingCard/BookingCard';
import Loader from '../../components/Loader/Loader';
import { getMyBookings, updateBookingStatus } from '../../api/bookingApi';
import './Bookings.css';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('requests');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const updated = await updateBookingStatus(id, status);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: updated.status ?? status } : b))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  const learnerBookings = bookings.filter(
    (b) => b.learner?._id === user?._id || b.learner === user?._id
  );
  const instructorBookings = bookings.filter(
    (b) => b.instructor?._id === user?._id || b.instructor === user?._id
  );

  const displayed = activeTab === 'requests' ? learnerBookings : instructorBookings;

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <div className="container">
          <h1 className="bookings-title">My Bookings</h1>
          <p className="bookings-subtitle">Manage your session requests and incoming bookings</p>
        </div>
      </div>

      <div className="container bookings-body">
        {/* Tabs */}
        <div className="bookings-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'requests'}
            className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            My Requests
            {learnerBookings.length > 0 && (
              <span className="tab-count">{learnerBookings.length}</span>
            )}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'incoming'}
            className={`tab-btn ${activeTab === 'incoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('incoming')}
          >
            Incoming Requests
            {instructorBookings.filter((b) => b.status === 'pending').length > 0 && (
              <span className="tab-count tab-count--warn">
                {instructorBookings.filter((b) => b.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <Loader size="md" text="Loading bookings..." />
        ) : displayed.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              {activeTab === 'requests' ? '📅' : '📬'}
            </div>
            <h3>
              {activeTab === 'requests' ? 'No booking requests yet' : 'No incoming requests'}
            </h3>
            <p>
              {activeTab === 'requests'
                ? 'Browse skills and book a session to get started.'
                : 'When learners book your skills, they will appear here.'}
            </p>
          </div>
        ) : (
          <div className="bookings-list">
            {displayed.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                currentUserId={user?._id}
                onStatusUpdate={activeTab === 'incoming' ? handleStatusUpdate : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
