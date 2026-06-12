import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateSkillForm } from '../../utils/validateForm';
import { createSkill } from '../../api/skillApi';
import './CreateSkill.css';

const CATEGORIES = ['Programming', 'Design', 'Music', 'Language', 'Business', 'Science', 'Other'];
const AVAILABILITIES = ['Weekdays', 'Weekends', 'Evenings', 'Mornings', 'Flexible', 'By Appointment'];

const CreateSkill = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    availability: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      await createSkill(form);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create skill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="skill-form-page">
      <div className="container">
        <div className="skill-form-card">
          <div className="skill-form-header">
            <h1 className="skill-form-title">Create a New Skill</h1>
            <p className="skill-form-subtitle">
              Share your expertise with the SkillXchange community
            </p>
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
                placeholder="e.g., Introduction to Python, Guitar for Beginners"
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
                placeholder="Describe what you'll teach, your experience level, and what learners can expect..."
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
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Skill'}
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

export default CreateSkill;
