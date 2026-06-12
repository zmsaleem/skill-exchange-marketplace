import './Loader.css';

const Loader = ({ size = 'md', text = '' }) => (
  <div className={`loader-wrapper loader-${size}`}>
    <div className="spinner"></div>
    {text && <p className="loader-text">{text}</p>}
  </div>
);

export default Loader;
