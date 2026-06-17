import { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/Loader/Loader';
import { getAllBookings } from '../../api/bookingApi';
import { getUsers, updateUser, deleteUser } from '../../api/userApi';
import './AdminDashboard.css';

const STATUS_OPTIONS = ['all', 'pending', 'accepted', 'rejected', 'completed'];
const ROLE_OPTIONS = ['all', 'learner', 'instructor', 'both', 'admin'];

const formatCsvValue = (value) => {
  if (value === undefined || value === null) return '';
  return String(value).replace(/"/g, '""');
};

const exportCsv = (filename, columns, rows) => {
  const header = columns.map((col) => `"${col.label}"`).join(',');
  const body = rows
    .map((row) =>
      columns
        .map((col) => `"${formatCsvValue(col.getValue(row))}"`)
        .join(',')
    )
    .join('\n');

  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookingStatus, setBookingStatus] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [activitySearch, setActivitySearch] = useState('');
  const [savingUserId, setSavingUserId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const [bookingsData, usersData] = await Promise.all([
          getAllBookings(),
          getUsers(),
        ]);
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (!user) return null;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus = bookingStatus === 'all' || booking.status === bookingStatus;
      const query = bookingSearch.trim().toLowerCase();

      if (!matchesStatus || !query) return matchesStatus;

      const skillTitle = booking.skill?.title?.toLowerCase() || '';
      const learnerName = booking.learner?.name?.toLowerCase() || '';
      const instructorName = booking.instructor?.name?.toLowerCase() || '';
      return (
        skillTitle.includes(query) ||
        learnerName.includes(query) ||
        instructorName.includes(query) ||
        booking.status.includes(query)
      );
    });
  }, [bookings, bookingStatus, bookingSearch]);

  const filteredUsers = useMemo(() => {
    return users.filter((profile) => {
      const matchesRole = userRoleFilter === 'all' || profile.role === userRoleFilter;
      const query = userSearch.trim().toLowerCase();
      if (!matchesRole || !query) return matchesRole;
      return (
        profile.name.toLowerCase().includes(query) ||
        profile.email.toLowerCase().includes(query) ||
        profile.role.toLowerCase().includes(query)
      );
    });
  }, [users, userRoleFilter, userSearch]);

  const activityLog = useMemo(() => {
    const bookingEvents = bookings.map((booking) => ({
      id: `booking-${booking._id}`,
      type: 'booking',
      date: new Date(booking.createdAt),
      label: `${booking.learner?.name || 'Learner'} booked ${booking.skill?.title || 'a skill'} with ${booking.instructor?.name || 'Instructor'}`,
      detail: `${booking.status} · ${new Date(booking.date).toLocaleDateString()}`,
    }));

    const userEvents = users.map((profile) => ({
      id: `user-${profile._id}`,
      type: 'user',
      date: new Date(profile.createdAt),
      label: `${profile.name} registered as ${profile.role}`,
      detail: profile.email,
    }));

    return [...bookingEvents, ...userEvents]
      .sort((a, b) => b.date - a.date)
      .filter((event) => {
        const query = activitySearch.trim().toLowerCase();
        if (!query) return true;
        return (
          event.label.toLowerCase().includes(query) ||
          event.detail.toLowerCase().includes(query)
        );
      });
  }, [bookings, users, activitySearch]);

  const stats = useMemo(() => ({
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === 'pending').length,
    completedBookings: bookings.filter((b) => b.status === 'completed').length,
    totalUsers: users.length,
    adminUsers: users.filter((u) => u.role === 'admin').length,
  }), [bookings, users]);

  const handleRoleChange = async (userId, newRole) => {
    setSavingUserId(userId);
    try {
      const updated = await updateUser(userId, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === userId ? updated : u)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setSavingUserId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user permanently?')) return;
    setSavingUserId(userId);
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setSavingUserId(null);
    }
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-header">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <p>Manage marketplace bookings, users, exports, and system activity.</p>
        </div>
      </div>

      <div className="container admin-body">
        {error && <div className="alert alert-error">{error}</div>}

        <div className="admin-layout">
          <aside className="admin-sidebar">
            <div className="sidebar-card">
              <h3>Admin Navigation</h3>
              <div className="sidebar-links">
                <button
                  className={activeTab === 'bookings' ? 'sidebar-link active' : 'sidebar-link'}
                  onClick={() => setActiveTab('bookings')}
                >
                  All Bookings
                </button>
                <button
                  className={activeTab === 'users' ? 'sidebar-link active' : 'sidebar-link'}
                  onClick={() => setActiveTab('users')}
                >
                  Users
                </button>
                <button
                  className={activeTab === 'activity' ? 'sidebar-link active' : 'sidebar-link'}
                  onClick={() => setActiveTab('activity')}
                >
                  Activity Log
                </button>
              </div>
            </div>

            <div className="sidebar-card sidebar-stats">
              <h4>Quick Stats</h4>
              <div className="stats-grid">
                <div className="stat-tile">
                  <span>Total users</span>
                  <strong>{stats.totalUsers}</strong>
                </div>
                <div className="stat-tile">
                  <span>Admins</span>
                  <strong>{stats.adminUsers}</strong>
                </div>
                <div className="stat-tile">
                  <span>Total bookings</span>
                  <strong>{stats.totalBookings}</strong>
                </div>
                <div className="stat-tile">
                  <span>Pending</span>
                  <strong>{stats.pendingBookings}</strong>
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <h4>Recent activity</h4>
              <ul className="activity-preview-list">
                {activityLog.slice(0, 4).map((event) => (
                  <li key={event.id}>
                    <p>{event.label}</p>
                    <span>{event.detail}</span>
                  </li>
                ))}
                {activityLog.length === 0 && <li>No recent activity</li>}
              </ul>
            </div>
          </aside>

          <main className="admin-main">
            <div className="admin-tabs admin-tabs--compact">
              <button
                className={activeTab === 'bookings' ? 'tab-btn active' : 'tab-btn'}
                onClick={() => setActiveTab('bookings')}
              >
                Bookings
              </button>
              <button
                className={activeTab === 'users' ? 'tab-btn active' : 'tab-btn'}
                onClick={() => setActiveTab('users')}
              >
                Users
              </button>
              <button
                className={activeTab === 'activity' ? 'tab-btn active' : 'tab-btn'}
                onClick={() => setActiveTab('activity')}
              >
                Activity Log
              </button>
            </div>

            {loading ? (
              <Loader size="lg" text="Loading admin data..." />
            ) : activeTab === 'bookings' ? (
              <section className="admin-panel">
                <div className="admin-panel-header">
                  <div>
                    <h2>Bookings</h2>
                    <p>View and export all bookings across the system.</p>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      exportCsv(
                        'bookings-export.csv',
                        [
                          { label: 'Skill', getValue: (row) => row.skill?.title },
                          { label: 'Instructor', getValue: (row) => row.instructor?.name },
                          { label: 'Learner', getValue: (row) => row.learner?.name },
                          { label: 'Status', getValue: (row) => row.status },
                          { label: 'Date', getValue: (row) => row.date },
                          { label: 'Message', getValue: (row) => row.message },
                        ],
                        filteredBookings
                      )
                    }
                  >
                    Export Bookings
                  </button>
                </div>

                <div className="admin-filters-grid">
                  <div className="filter-item">
                    <label>Status filter</label>
                    <select
                      value={bookingStatus}
                      onChange={(e) => setBookingStatus(e.target.value)}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div className="filter-item">
                    <label>Search bookings</label>
                    <input
                      type="search"
                      placeholder="Search skill, learner, instructor..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-table-container">
                  {filteredBookings.length === 0 ? (
                    <div className="empty-state">
                      <h3>No bookings found</h3>
                      <p>Try a different filter or search term.</p>
                    </div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Skill</th>
                          <th>Instructor</th>
                          <th>Learner</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Message</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((booking) => (
                          <tr key={booking._id}>
                            <td>{booking.skill?.title || '—'}</td>
                            <td>{booking.instructor?.name || '—'}</td>
                            <td>{booking.learner?.name || '—'}</td>
                            <td>{booking.status}</td>
                            <td>{new Date(booking.date).toLocaleDateString()}</td>
                            <td>{booking.message || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            ) : activeTab === 'users' ? (
              <section className="admin-panel">
                <div className="admin-panel-header">
                  <div>
                    <h2>Users</h2>
                    <p>Review registered users and manage roles or accounts.</p>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      exportCsv(
                        'users-export.csv',
                        [
                          { label: 'Name', getValue: (row) => row.name },
                          { label: 'Email', getValue: (row) => row.email },
                          { label: 'Role', getValue: (row) => row.role },
                          { label: 'Bio', getValue: (row) => row.bio },
                          { label: 'Joined', getValue: (row) => new Date(row.createdAt).toLocaleDateString() },
                        ],
                        filteredUsers
                      )
                    }
                  >
                    Export Users
                  </button>
                </div>

                <div className="admin-filters-grid">
                  <div className="filter-item">
                    <label>Role filter</label>
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div className="filter-item">
                    <label>Search users</label>
                    <input
                      type="search"
                      placeholder="Search by name, email or role"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-table-container">
                  {filteredUsers.length === 0 ? (
                    <div className="empty-state">
                      <h3>No users found</h3>
                      <p>Try changing the filters or search term.</p>
                    </div>
                  ) : (
                    <table className="admin-table admin-table--users">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Joined</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((profile) => (
                          <tr key={profile._id}>
                            <td>{profile.name}</td>
                            <td>{profile.email}</td>
                            <td>
                              <select
                                value={profile.role}
                                disabled={savingUserId === profile._id}
                                onChange={(e) => handleRoleChange(profile._id, e.target.value)}
                              >
                                {ROLE_OPTIONS.filter((role) => role !== 'all').map((role) => (
                                  <option key={role} value={role}>{role}</option>
                                ))}
                              </select>
                            </td>
                            <td>{new Date(profile.createdAt).toLocaleDateString()}</td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                disabled={profile._id === user._id || savingUserId === profile._id}
                                onClick={() => handleDeleteUser(profile._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            ) : (
              <section className="admin-panel">
                <div className="admin-panel-header">
                  <div>
                    <h2>Activity Log</h2>
                    <p>Monitor recent user and booking activity at a glance.</p>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      exportCsv(
                        'activity-export.csv',
                        [
                          { label: 'Event', getValue: (row) => row.label },
                          { label: 'Detail', getValue: (row) => row.detail },
                          { label: 'Date', getValue: (row) => row.date },
                        ],
                        activityLog
                      )
                    }
                  >
                    Export Activity
                  </button>
                </div>

                <div className="admin-filters-grid">
                  <div className="filter-item">
                    <label>Search activity</label>
                    <input
                      type="search"
                      placeholder="Search event, user, or detail"
                      value={activitySearch}
                      onChange={(e) => setActivitySearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="activity-log-list">
                  {activityLog.length === 0 ? (
                    <div className="empty-state">
                      <h3>No activity found</h3>
                      <p>Try a different search term.</p>
                    </div>
                  ) : (
                    <ul>
                      {activityLog.map((event) => (
                        <li key={event.id} className="activity-log-item">
                          <div>
                            <p className="activity-label">{event.label}</p>
                            <p className="activity-detail">{event.detail}</p>
                          </div>
                          <span className="activity-date">{event.date.toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
