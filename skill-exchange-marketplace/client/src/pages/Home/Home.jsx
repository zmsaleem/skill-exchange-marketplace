import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SkillCard from '../../components/SkillCard/SkillCard';
import Loader from '../../components/Loader/Loader';
import { getSkills } from '../../api/skillApi';
import './Home.css';

const STATS = [
  { value: '500+', label: 'Skills Listed' },
  { value: '1,200+', label: 'Active Learners' },
  { value: '850+', label: 'Sessions Completed' },
];

const STEPS = [
  {
    number: '01',
    icon: '📝',
    title: 'List Your Skills',
    description: 'Create a profile and list the skills you can teach. Set your availability and let others find you.',
  },
  {
    number: '02',
    icon: '🔍',
    title: 'Browse & Connect',
    description: 'Discover skills offered by others in the community. Filter by category and find the perfect match.',
  },
  {
    number: '03',
    icon: '📚',
    title: 'Book & Learn',
    description: 'Book a session with your chosen instructor. Learn, grow, and leave a review for the community.',
  },
];

const Home = () => {
  const [featuredSkills, setFeaturedSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeatured = useCallback(async () => {
    try {
      const data = await getSkills('', '');
      setFeaturedSkills(Array.isArray(data) ? data.slice(0, 6) : []);
    } catch {
      setFeaturedSkills([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="hero-badge">🚀 Community-Powered Learning</span>
            <h1 className="hero-title">
              Exchange Skills.<br />
              Learn Together.<br />
              <span className="hero-highlight">Grow Forever.</span>
            </h1>
            <p className="hero-subtitle">
              Connect with passionate learners and experts. Share your knowledge,
              gain new skills, and build a stronger community — all in one place.
            </p>
            <div className="hero-actions">
              <Link to="/browse" className="btn btn-primary btn-lg">
                Browse Skills
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                Get Started Free
              </Link>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-card hero-card-1">
              <span className="hero-card-icon">🎨</span>
              <div>
                <p className="hero-card-title">UI/UX Design</p>
                <p className="hero-card-sub">Design • Sarah K.</p>
              </div>
            </div>
            <div className="hero-card hero-card-2">
              <span className="hero-card-icon">💻</span>
              <div>
                <p className="hero-card-title">React Development</p>
                <p className="hero-card-sub">Programming • Alex M.</p>
              </div>
            </div>
            <div className="hero-card hero-card-3">
              <span className="hero-card-icon">🎸</span>
              <div>
                <p className="hero-card-title">Guitar Lessons</p>
                <p className="hero-card-sub">Music • Jamie R.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to start exchanging skills</p>
          </div>
          <div className="steps-grid">
            {STEPS.map((step) => (
              <div key={step.number} className="step-card">
                <div className="step-number">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="featured-skills">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Skills</h2>
            <p className="section-subtitle">Discover what the community is offering</p>
          </div>

          {loading ? (
            <Loader size="md" text="Loading skills..." />
          ) : featuredSkills.length > 0 ? (
            <>
              <div className="skills-grid">
                {featuredSkills.map((skill) => (
                  <SkillCard key={skill._id} skill={skill} />
                ))}
              </div>
              <div className="featured-cta">
                <Link to="/browse" className="btn btn-outline">
                  View All Skills →
                </Link>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🎓</div>
              <h3>No skills yet</h3>
              <p>Be the first to share your expertise!</p>
              <Link to="/create-skill" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Create a Skill
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <h2 className="stats-heading">Join thousands of learners</h2>
          <p className="stats-subheading">Our community keeps growing every day</p>
          <div className="stats-grid">
            {STATS.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="cta-section">
        <div className="container cta-inner">
          <h2 className="cta-title">Ready to start learning?</h2>
          <p className="cta-subtitle">
            Join our community today and start exchanging skills with passionate people around the world.
          </p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Free Account
            </Link>
            <Link to="/browse" className="btn btn-outline btn-lg">
              Explore Skills
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
