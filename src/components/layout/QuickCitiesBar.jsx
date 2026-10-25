import React from 'react';
import { Sparkles } from 'lucide-react';
import { useCity } from '../../context/CityContext';
import './QuickCitiesBar.css';

const POPULAR_CITIES = [
  { id: 1850147, name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', latitude: 35.6895, longitude: 139.6917, timezone: 'Asia/Tokyo' },
  { id: 2988507, name: 'Paris', country: 'France', admin1: 'Île-de-France', latitude: 48.8534, longitude: 2.3488, timezone: 'Europe/Paris' },
  { id: 2643743, name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.5085, longitude: -0.1257, timezone: 'Europe/London' },
  { id: 5128581, name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.7143, longitude: -74.006, timezone: 'America/New_York' },
  { id: 1261481, name: 'New Delhi', country: 'India', admin1: 'Delhi', latitude: 28.6139, longitude: 77.209, timezone: 'Asia/Kolkata' },
  { id: 2147714, name: 'Sydney', country: 'Australia', admin1: 'New South Wales', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' }
];

export function QuickCitiesBar() {
  const { selectedCity, setSelectedCity } = useCity();

  return (
    <div className="quick-cities-bar">
      <span className="quick-cities-label">
        <Sparkles size={13} className="quick-sparkle-icon" />
        <span>Popular:</span>
      </span>
      <div className="quick-cities-pills">
        {POPULAR_CITIES.map((city) => {
          const isActive = selectedCity.latitude === city.latitude && selectedCity.longitude === city.longitude;
          return (
            <button
              key={`quick-${city.name}`}
              type="button"
              className={`glass-pill quick-city-pill ${isActive ? 'quick-city-active' : ''}`}
              onClick={() => setSelectedCity(city)}
            >
              {city.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
