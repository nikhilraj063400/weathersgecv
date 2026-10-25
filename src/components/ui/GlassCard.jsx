import React from 'react';

/**
 * Reusable Frosted Glass Window Panel with specular top sheen & noise
 */
export function GlassCard({
  children,
  className = '',
  interactive = false,
  onClick,
  style = {},
  id,
  role,
  tabIndex,
  onKeyDown
}) {
  const combinedClassName = `glass-card ${interactive ? 'glass-card-interactive' : ''} ${className}`.trim();

  return (
    <div
      id={id}
      className={combinedClassName}
      onClick={onClick}
      style={style}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}
