import React from 'react';
import { GlassCard } from './GlassCard';
import './Skeleton.css';

export function WeatherSkeleton() {
  return (
    <div className="skeleton-container" aria-label="Loading forecast...">
      {/* Hero Skeleton */}
      <GlassCard className="skeleton-hero-card">
        <div className="skeleton-row-spaced">
          <div className="skeleton-box skeleton-title" style={{ width: '45%', height: '28px' }} />
          <div className="skeleton-box" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
        </div>
        <div className="skeleton-box skeleton-city" style={{ width: '60%', height: '40px', marginTop: '16px' }} />
        <div className="skeleton-box skeleton-temp" style={{ width: '50%', height: '110px', marginTop: '20px' }} />
        <div className="skeleton-box" style={{ width: '35%', height: '22px', marginTop: '16px' }} />
        <div className="skeleton-box" style={{ width: '45%', height: '18px', marginTop: '12px' }} />
      </GlassCard>

      {/* Hourly Strip Skeleton */}
      <GlassCard className="skeleton-strip-card">
        <div className="skeleton-box" style={{ width: '160px', height: '24px', marginBottom: '16px' }} />
        <div className="skeleton-hourly-row">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-box skeleton-hourly-item" />
          ))}
        </div>
      </GlassCard>

      {/* Daily & Details Skeleton */}
      <div className="skeleton-grid">
        <GlassCard className="skeleton-card">
          <div className="skeleton-box" style={{ width: '180px', height: '24px', marginBottom: '16px' }} />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-box" style={{ width: '100%', height: '44px', marginBottom: '10px' }} />
          ))}
        </GlassCard>
        <GlassCard className="skeleton-card">
          <div className="skeleton-box" style={{ width: '140px', height: '24px', marginBottom: '16px' }} />
          <div className="skeleton-details-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-box" style={{ height: '90px', borderRadius: '16px' }} />
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
