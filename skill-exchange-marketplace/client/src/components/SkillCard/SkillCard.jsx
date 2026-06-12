import { Link } from 'react-router-dom';
import './SkillCard.css';

const categoryColors = {
  Programming: '#4F46E5',
  Design: '#EC4899',
  Music: '#8B5CF6',
  Language: '#10B981',
  Business: '#F59E0B',
  Science: '#3B82F6',
  Other: '#6B7280',
};

const SkillCard = ({ skill }) => (
  <div className="skill-card">
    <div className="skill-card-header">
      <span
        className="category-badge"
        style={{ backgroundColor: categoryColors[skill.category] || '#6B7280' }}
      >
        {skill.category}
      </span>
    </div>
    <div className="skill-card-body">
      <h3 className="skill-title">{skill.title}</h3>
      <p className="skill-description">
        {skill.description?.substring(0, 120)}
        {skill.description?.length > 120 ? '...' : ''}
      </p>
    </div>
    <div className="skill-card-footer">
      <div className="instructor-info">
        <div className="instructor-avatar">
          {skill.instructor?.name?.charAt(0).toUpperCase()}
        </div>
        <span className="instructor-name">{skill.instructor?.name || 'Instructor'}</span>
      </div>
      <span className="availability-tag">{skill.availability}</span>
      <Link to={`/skills/${skill._id}`} className="view-btn">
        View Details
      </Link>
    </div>
  </div>
);

export default SkillCard;
