import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    skillsToTeach: Array.isArray(user?.skillsToTeach) ? user.skillsToTeach.join(', ') : '',
    profilePicture: user?.profilePicture || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const skillsArray = form.skillsToTeach
        ? form.skillsToTeach.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      await updateProfile({
        name: form.name.trim(),
        bio: form.bio.trim(),
        skillsToTeach: skillsArray,
        profilePicture: form.profilePicture.trim(),
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">
          {/* Profile Info Card */}
          <div className="profile-sidebar">
            <div className="profile-avatar-card">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="profile-avatar-img"
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <h2 className="profile-name">{user?.name}</h2>
              <p className="profile-email">{user?.email}</p>
              <span className="profile-role-badge">{user?.role || 'Member'}</span>
            </div>

            {user?.skillsToTeach?.length > 0 && (
              <div className="profile-skills-card">
                <h3 className="profile-skills-title">Skills I Teach</h3>
                <div className="profile-skills-tags">
                  {user.skillsToTeach.map((skill, i) => (
                    <span key={i} className="profile-skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Edit Form */}
          <div className="profile-form-section">
            <div className="profile-form-card">
              <h1 className="profile-form-title">Edit Profile</h1>

              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-input"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="form-textarea"
                    rows={4}
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Tell the community about yourself, your expertise, and your learning goals..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="skillsToTeach">Skills I Can Teach</label>
                  <input
                    id="skillsToTeach"
                    name="skillsToTeach"
                    type="text"
                    className="form-input"
                    value={form.skillsToTeach}
                    onChange={handleChange}
                    placeholder="Python, Guitar, Design, Spanish... (comma-separated)"
                  />
                  <p className="form-helper">Enter skills separated by commas</p>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profilePicture">Profile Picture URL</label>
                  <input
                    id="profilePicture"
                    name="profilePicture"
                    type="url"
                    className="form-input"
                    value={form.profilePicture}
                    onChange={handleChange}
                    placeholder="https://example.com/my-photo.jpg"
                  />
                  <p className="form-helper">Enter a URL for your profile picture</p>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
