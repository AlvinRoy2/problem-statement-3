import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Timeline from './components/Timeline';
import Chatbot from './components/Chatbot';
import StepDetails from './pages/StepDetails';
import { detectLocation } from './utils/apiService';
import './App.css';

function MainTimeline({ progressStep, location }) {
    const loc = useLocation();
    
    useEffect(() => {
        if (loc.hash === '#timeline-section') {
            setTimeout(() => {
                document.getElementById('timeline-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            window.scrollTo(0, 0);
        }
    }, [loc]);

    // Update search URL for Indian context (ECI Electoral Search)
    const eciSearchUrl = 'https://electoralsearch.eci.gov.in/';

    return (
        <>
            <header className="hero" role="banner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="hero-bg-image" aria-hidden="true">
                    <img src="/hero_banner.png" alt="Indian Election Header" className="hero-img" />
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
            <Timeline progressStep={progressStep} />
        </>
    );
}

function App() {
    const [location, setLocation] = useState(null);
    const [progressStep, setProgressStep] = useState(() => {
        try {
            const data = localStorage.getItem('electionState');
            return data ? JSON.parse(data).progressStep || 0 : 0;
        } catch (e) {
            return 0;
        }
    });

    useEffect(() => {
        const fetchLocation = async () => {
            const loc = await detectLocation();
            setLocation(loc);
        };
        fetchLocation();
    }, []);

    const updateStep = useCallback((newStep) => {
        setProgressStep(newStep);
        try {
            const data = localStorage.getItem('electionState');
            const state = data ? JSON.parse(data) : {};
            localStorage.setItem('electionState', JSON.stringify({ ...state, progressStep: newStep }));
        } catch (e) {}
    }, []);

    // Persist state
    useEffect(() => {
        try {
            const data = localStorage.getItem('electionState');
            const state = data ? JSON.parse(data) : {};
            localStorage.setItem('electionState', JSON.stringify({ ...state, location, progressStep }));
        } catch (e) {}
    }, [location, progressStep]);

    return (
        <Router>
            <div className="background-elements" aria-hidden="true">
                <div className="blob shape1"></div>
                <div className="blob shape2"></div>
            </div>

            <Routes>
                <Route path="/" element={<MainTimeline progressStep={progressStep} location={location} />} />
                <Route path="/step/:id" element={<StepDetails location={location} />} />
            </Routes>
            
            <Chatbot 
                location={location} 
                progressStep={progressStep} 
                updateStep={updateStep} 
            />
        </Router>
    );
}

export default App;
