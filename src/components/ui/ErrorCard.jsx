import React from 'react';
import { AlertCircle, RefreshCw, Compass } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useCity } from '../../context/CityContext';
import { DEFAULT_CITY } from '../../constants/config';
import './ErrorCard.css';

export function ErrorCard({ message, onRetry }) {
  const { setSelectedCity } = useCity();

  const fallbackCities = [
    DEFAULT_CITY,
    { id: 2643743, name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.5085, longitude: -0.1257, timezone: 'Europe/London' },
    { id: 5128581, name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.7143, longitude: -74.006, timezone: 'America/New_York' },
    { id: 2988507, name: 'Paris', country: 'France', admin1: 'Île-de-France', latitude: 48.8534, longitude: 2.3488, timezone: 'Europe/Paris' }
  ];

  return (
    <GlassCard className="error-card">
      <div className="error-icon-wrapper">
        <AlertCircle size={36} className="error-icon" />
      </div>

      <h2 className="error-title">Weather Data Unavailable</h2>
      <p className="error-message">{message || 'Unable to connect to the weather service right now.'}</p>

      {onRetry && (
        <button type="button" className="btn-primary error-retry-btn" onClick={onRetry}>
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      )}

      <div className="error-fallback-section">
        <span className="fallback-label">
          <Compass size={14} /> Or explore these destinations:
        </span>
        <div className="fallback-pills">
          {fallbackCities.map((city) => (
            <button
              key={`fallback-${city.name}`}
              type="button"
              className="glass-pill fallback-pill"
              onClick={() => setSelectedCity(city)}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
