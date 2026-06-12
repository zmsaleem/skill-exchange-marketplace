import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>⚡ SkillXchange</h3>
          <p>Exchange Skills. Learn Together. Grow Forever.</p>
        </div>
        <div className="footer-links">
          <a href="/browse">Browse Skills</a>
          <a href="/register">Join Now</a>
          <a href="/login">Login</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SkillXchange. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
