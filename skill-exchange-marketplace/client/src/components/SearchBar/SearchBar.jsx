import { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = 'Search skills...' }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), 300);
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className="search-bar">
      <svg
        className="search-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="search-input"
        aria-label={placeholder}
      />
      {value && (
        <button
          className="search-clear"
          onClick={() => setValue('')}
          aria-label="Clear search"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;
