import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2, MapPin, History } from 'lucide-react';
import { useCitySearch } from '../../hooks/useCitySearch';
import { useCity } from '../../context/CityContext';
import './SearchBar.css';

export function SearchBar() {
  const { setSelectedCity, recentCities } = useCity();
  const {
    query,
    setQuery,
    suggestions,
    isLoading,
    error,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    clear
  } = useCitySearch();

  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    setSelectedCity(city);
    clear();
    setIsFocused(false);
  };

  const showRecent = isFocused && query.trim().length === 0 && recentCities.length > 0;
  const showDropdown = isFocused && (suggestions.length > 0 || showRecent || (query.trim().length >= 2 && !isLoading));

  return (
    <div className="search-container" ref={containerRef}>
      <div className={`search-input-wrapper glass-pill ${isFocused ? 'search-input-focused' : ''}`}>
        <Search className="search-icon" size={18} aria-hidden="true" />
        <input
          type="text"
          id="city-search-input"
          className="search-input"
          placeholder="Search any city in the world..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => handleKeyDown(e, handleSelect)}
          autoComplete="off"
          spellCheck="false"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls="city-suggestions-list"
        />

        {isLoading && <Loader2 className="search-spinner" size={16} />}

        {query.length > 0 && !isLoading && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={clear}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div id="city-suggestions-list" className="search-dropdown" role="listbox">
          {showRecent && (
            <div className="dropdown-section">
              <div className="dropdown-header">
                <History size={13} />
                <span>Recent Searches</span>
              </div>
              {recentCities.map((city, idx) => (
                <div
                  key={`recent-${city.latitude}-${city.longitude}-${idx}`}
                  className="dropdown-item"
                  onClick={() => handleSelect(city)}
                  role="option"
                  aria-selected={false}
                >
                  <MapPin size={15} className="item-pin-icon" />
                  <div className="item-text">
                    <span className="item-city-name">{city.name}</span>
                    <span className="item-details">
                      {[city.admin1, city.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showRecent && suggestions.length > 0 && (
            <div className="dropdown-section">
              {suggestions.map((city, idx) => (
                <div
                  key={`suggest-${city.latitude}-${city.longitude}-${idx}`}
                  className={`dropdown-item ${selectedIndex === idx ? 'dropdown-item-selected' : ''}`}
                  onClick={() => handleSelect(city)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  role="option"
                  aria-selected={selectedIndex === idx}
                >
                  <MapPin size={15} className="item-pin-icon" />
                  <div className="item-text">
                    <span className="item-city-name">{city.name}</span>
                    <span className="item-details">
                      {[city.admin1, city.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                  {city.country_code && (
                    <span className="item-country-badge">{city.country_code}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {!showRecent && !isLoading && suggestions.length === 0 && query.trim().length >= 2 && (
            <div className="dropdown-empty">
              <span>No cities found matching "{query}"</span>
            </div>
          )}

          {error && <div className="dropdown-error">{error}</div>}
        </div>
      )}
    </div>
  );
}
