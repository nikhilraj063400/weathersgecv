import React, { useState, useEffect } from 'react';
import { Sparkles, User, X } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { GlassCard } from './GlassCard';
import './NameModal.css';

export function NameModal() {
  const { userName, setUserName, isNameModalOpen, setIsNameModalOpen } = useUser();
  const [inputValue, setInputValue] = useState(userName || '');

  useEffect(() => {
    setInputValue(userName || '');
  }, [userName, isNameModalOpen]);

  if (!isNameModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      setUserName(trimmed);
    }
    setIsNameModalOpen(false);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <GlassCard className="name-modal-card">
        <button
          type="button"
          className="modal-close-btn"
          onClick={() => setIsNameModalOpen(false)}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="modal-icon-badge">
          <Sparkles className="sparkle-icon" size={24} />
        </div>

        <h2 id="modal-title" className="modal-title">
          {userName ? 'Personalize Your Experience' : 'Welcome to Aetheria'}
        </h2>
        <p className="modal-description">
          Experience the weather through dynamic frosted glass. What should we call you?
        </p>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-input-wrapper glass-pill">
            <User size={18} className="modal-user-icon" />
            <input
              type="text"
              id="user-name-input"
              className="modal-input"
              placeholder="Enter your name or nickname..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
              maxLength={30}
            />
          </div>

          <div className="modal-actions">
            {userName && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsNameModalOpen(false)}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn-primary"
              disabled={!inputValue.trim()}
            >
              {userName ? 'Save Name' : 'Step Inside'}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
