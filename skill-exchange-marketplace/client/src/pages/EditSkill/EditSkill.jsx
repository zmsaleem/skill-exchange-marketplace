import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/Loader/Loader';
import { validateSkillForm } from '../../utils/validateForm';
import { getSkillById, updateSkill } from '../../api/skillApi';
import '../CreateSkill/CreateSkill.css';
import './EditSkill.css';

const CATEGORIES = ['Programming', 'Design', 'Music', 'Language', 'Business', 'Science', 'Other'];
const AVAILABILITIES = ['Weekdays', 'Weekends', 'Evenings', 'Mornings', 'Flexible', 'By Appointment'];

const EditSkill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    availability: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notOwner, setNotOwner] = useState(false);

  const fetchSkill = useCallback(async () => {
    try {
      const skill = await getSkillById(id);
      const instructorId = skill.instructor?._id || skill.instructor;
      if (user && instructorId !== user._id) {
        setNotOwner(true);
        return;
      }
      setForm({
        title: skill.title || '',
        description: skill.description || '',
        category: skill.category || '',
        availability: skill.availability || '',
      });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to load skill');
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchSkill();
  }, [fetchSkill]);

  useEffect(() => {
    if (notOwner) {
      const timer = setTimeout(() => navigate('/dashboard'), 2000);
      return () => clearTimeout(timer);
    }
  }, [notOwner, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateSkillForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setApiError('');
    setSaving(true);
    try {
      await updateSkill(id, form);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to update skill.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader size="lg" text="Loading skill..." />;

  if (notOwner) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <div className="alert alert-error" style={{ maxWidth: 400, margin: '0 auto' }}>
          You are not the owner of this skill. Redirecting...
        </div>
      </div>
    );
  }

  return (
    <div className="skill-form-page">
      <div className="container">
        <div className="skill-form-card">
          <div className="skill-form-header">
            <h1 className="skill-form-title">Edit Skill</h1>
            <p className="skill-form-subtitle">Update your skill listing</p>
          </div>

          {apiError && <div className="alert alert-error">{apiError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="title">Skill Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="e.g., Introduction to Python"
                value={form.title}
                onChange={handleChange}
              />
              {errors.title && <p className="form-error">{errors.title}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                rows={5}
                placeholder="Describe what you'll teach..."
                value={form.description}
                onChange={handleChange}
              />
              {errors.description && <p className="form-error">{errors.description}</p>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  className={`form-select ${errors.category ? 'error' : ''}`}
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="form-error">{errors.category}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="availability">Availability *</label>
                <select
                  id="availability"
                  name="availability"
                  className={`form-select ${errors.availability ? 'error' : ''}`}
                  value={form.availability}
                  onChange={handleChange}
                >
                  <option value="">Select availability</option>
                  {AVAILABILITIES.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                {errors.availability && <p className="form-error">{errors.availability}</p>}
              </div>
            </div>

            <div className="skill-form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSkill;
