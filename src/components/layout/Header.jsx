import React from 'react';
import { CloudSun, Navigation, User, Heart, Compass } from 'lucide-react';
import { SearchBar } from '../ui/SearchBar';
import { useUser } from '../../context/UserContext';
import { useCity } from '../../context/CityContext';
import './Header.css';

export function Header() {
  const { userName, setIsNameModalOpen, tempUnit, toggleTempUnit, favorites } = useUser();
  const { useCurrentLocation, isLocating, selectedCity, setSelectedCity } = useCity();

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo-badge">
          <div className="logo-icon-wrap">
            <CloudSun className="logo-icon" size={24} />
          </div>
          <div className="logo-text-wrap">
            <span className="logo-title">Aetheria</span>
            <span className="logo-subtitle">Living Glass Forecast</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <SearchBar />
      </div>

      <div className="header-right">
        {/* Geolocation Button */}
        <button
          type="button"
          className={`glass-pill header-btn ${isLocating ? 'header-btn-locating' : ''}`}
          onClick={useCurrentLocation}
          title="Detect my location"
          aria-label="Detect my location"
        >
          <Navigation size={16} className={isLocating ? 'icon-spin' : ''} />
          <span className="btn-label-desktop">Locate</span>
        </button>

        {/* Units Toggle: °C / °F */}
        <button
          type="button"
          className="glass-pill header-btn unit-toggle-btn"
          onClick={toggleTempUnit}
          title={`Switch to ${tempUnit === 'c' ? '°F' : '°C'}`}
          aria-label={`Toggle temperature unit, current is °${tempUnit.toUpperCase()}`}
        >
          <span className={`unit-label ${tempUnit === 'c' ? 'unit-active' : ''}`}>°C</span>
          <span className="unit-divider">/</span>
          <span className={`unit-label ${tempUnit === 'f' ? 'unit-active' : ''}`}>°F</span>
        </button>

        {/* User Profile / Greeting Button */}
        <button
          type="button"
          className="glass-pill header-btn user-name-btn"
          onClick={() => setIsNameModalOpen(true)}
          title="Change visitor name"
          aria-label="Visitor profile"
        >
          <User size={16} className="user-avatar-icon" />
          <span className="user-name-text">
            {userName ? userName : 'Set Name'}
          </span>
        </button>
      </div>
    </header>
  );
}
