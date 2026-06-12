import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import BookingCard from '../../components/BookingCard/BookingCard';
import Loader from '../../components/Loader/Loader';
import { getMySkills, deleteSkill } from '../../api/skillApi';
import { getMyBookings } from '../../api/bookingApi';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [deleteError, setDeleteError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [skillsData, bookingsData] = await Promise.all([
        getMySkills(),
        getMyBookings(),
      ]);
      setSkills(Array.isArray(skillsData) ? skillsData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch {
      setSkills([]);
      setBookings([]);
    } finally {
      setLoadingSkills(false);
      setLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const recentBookings = bookings.slice(0, 5);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    setDeleteError('');
    try {
      await deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete skill');
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <h1 className="dashboard-welcome">Welcome back, {user?.name}! 👋</h1>
          <p className="dashboard-subtitle">Here&apos;s an overview of your activity</p>
        </div>
      </div>

      <div className="container dashboard-body">
        {/* Stats */}
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-item-value">{skills.length}</div>
            <div className="stat-item-label">My Skills</div>
          </div>
          <div className="stat-item stat-item--warning">
            <div className="stat-item-value">{pendingBookings.length}</div>
            <div className="stat-item-label">Pending Bookings</div>
          </div>
          <div className="stat-item stat-item--success">
            <div className="stat-item-value">{completedBookings.length}</div>
            <div className="stat-item-label">Completed Sessions</div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* My Skills */}
          <section className="dashboard-section">
            <div className="section-top">
              <h2 className="dashboard-section-title">My Skills</h2>
              <Link to="/create-skill" className="btn btn-primary btn-sm">
                + Create Skill
              </Link>
            </div>

            {deleteError && <div className="alert alert-error">{deleteError}</div>}

            {loadingSkills ? (
              <Loader size="sm" />
            ) : skills.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🎓</div>
                <h3>No skills yet</h3>
                <p>Share your expertise with the community.</p>
                <Link to="/create-skill" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
                  Create Your First Skill
                </Link>
              </div>
            ) : (
              <ul className="skills-list">
                {skills.map((skill) => (
                  <li key={skill._id} className="skill-list-item">
                    <div className="skill-list-info">
                      <span className="skill-list-title">{skill.title}</span>
                      <span className="skill-list-category">{skill.category}</span>
                    </div>
                    <div className="skill-list-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => navigate(`/skills/${skill._id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(skill._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Recent Bookings */}
          <section className="dashboard-section">
            <div className="section-top">
              <h2 className="dashboard-section-title">Recent Bookings</h2>
              <Link to="/bookings" className="btn btn-ghost btn-sm">
                View All →
              </Link>
            </div>

            {loadingBookings ? (
              <Loader size="sm" />
            ) : recentBookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📅</div>
                <h3>No bookings yet</h3>
                <p>Browse skills to book your first session.</p>
                <Link to="/browse" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
                  Browse Skills
                </Link>
              </div>
            ) : (
              <div className="bookings-list">
                {recentBookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    currentUserId={user?._id}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2 className="dashboard-section-title" style={{ marginBottom: '1rem' }}>
            Quick Actions
          </h2>
          <div className="quick-actions-grid">
            <Link to="/create-skill" className="quick-action-card">
              <span className="quick-action-icon">➕</span>
              <span className="quick-action-label">Create Skill</span>
            </Link>
            <Link to="/browse" className="quick-action-card">
              <span className="quick-action-icon">🔍</span>
              <span className="quick-action-label">Browse Skills</span>
            </Link>
            <Link to="/bookings" className="quick-action-card">
              <span className="quick-action-icon">📅</span>
              <span className="quick-action-label">My Bookings</span>
            </Link>
            <Link to="/profile" className="quick-action-card">
              <span className="quick-action-icon">👤</span>
              <span className="quick-action-label">Edit Profile</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
