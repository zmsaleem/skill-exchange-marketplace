import { useState, useEffect, useCallback } from 'react';
import SkillCard from '../../components/SkillCard/SkillCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import Loader from '../../components/Loader/Loader';
import { getSkills } from '../../api/skillApi';
import './BrowseSkills.css';

const CATEGORIES = [
  'All', 'Programming', 'Design', 'Music', 'Language', 'Business', 'Science', 'Other',
];

const BrowseSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const fetchSkills = useCallback(async (searchTerm, category) => {
    setLoading(true);
    setError('');
    try {
      const cat = category === 'All' ? '' : category;
      const data = await getSkills(searchTerm, cat);
      setSkills(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load skills');
      setSkills([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills(search, activeCategory);
  }, [search, activeCategory, fetchSkills]);

  const handleSearch = useCallback((value) => {
    setSearch(value);
  }, []);

  const handleCategory = (cat) => {
    setActiveCategory(cat);
  };

  return (
    <div className="browse-page">
      <div className="browse-header">
        <div className="container">
          <h1 className="browse-title">Browse Skills</h1>
          <p className="browse-subtitle">
            Discover {skills.length > 0 ? `${skills.length}+ ` : ''}skills shared by our community
          </p>
          <SearchBar onSearch={handleSearch} placeholder="Search skills, topics, instructors..." />
        </div>
      </div>

      <div className="container browse-body">
        {/* Category filters */}
        <div className="category-filters" role="group" aria-label="Filter by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results */}
        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <Loader size="md" text="Loading skills..." />
        ) : skills.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No skills found</h3>
            <p>
              {search || activeCategory !== 'All'
                ? 'Try adjusting your search or filter.'
                : 'Be the first to share a skill!'}
            </p>
          </div>
        ) : (
          <div className="browse-grid">
            {skills.map((skill) => (
              <SkillCard key={skill._id} skill={skill} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseSkills;
