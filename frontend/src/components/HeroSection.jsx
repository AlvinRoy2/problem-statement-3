import React, { memo } from 'react';

/**
 * HeroSection Component
 * Displays the main header banner, call to actions, and basic stats.
 * Wrapped in React.memo to prevent unnecessary re-renders when global state changes.
 */
const HeroSection = memo(({ location }) => {
    // Update search URL for Indian context (ECI Electoral Search)
    const eciSearchUrl = 'https://electoralsearch.eci.gov.in/';

    return (
        <header className="hero" role="banner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="hero-bg-image" aria-hidden="true">
                <img src="/hero_banner.png" alt="" className="hero-img" />
                <div className="hero-img-overlay" />
            </div>
            
            <div className="hero-content glass-panel">
                <div className="hero-badge">🇮🇳 Indian Election Assistant</div>
                <h1 style={{ marginTop: '10px' }}>Your Vote, India's Future</h1>
                <p>Navigate the Indian electoral process effortlessly with our AI-powered Timeline and Smart Voting Assistant.</p>
                
                <div className="hero-cta-row">
                    <a href="#timeline-section" className="btn primary-btn" aria-label="Start the guide">How to Vote</a>
                    <a 
                        href={eciSearchUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn secondary-btn" 
                        aria-label="Find polling station in India"
                    >
                        📍 Search Electoral Roll
                    </a>
                </div>
                
                <div className="hero-stats" aria-label="Quick statistics">
                    <div className="hero-stat"><span>4</span><small>Key Steps</small></div>
                    <div className="hero-stat-divider" aria-hidden="true" />
                    <div className="hero-stat"><span>ECI</span><small>Smart Guide</small></div>
                    <div className="hero-stat-divider" aria-hidden="true" />
                    <div className="hero-stat">
                        <span>{location?.city ? '📍' : '🌎'}</span>
                        <small>{location?.city || 'Detecting Location...'}</small>
                    </div>
                </div>
            </div>
        </header>
    );
});

export default HeroSection;
