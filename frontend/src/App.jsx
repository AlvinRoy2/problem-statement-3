import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Timeline from './components/Timeline';
import HeroSection from './components/HeroSection';
import { useElectionState } from './utils/useElectionState';
import { initGA } from './utils/googleAnalytics';
import './App.css';

// Lazy loading components for better Code Quality and Efficiency
const Chatbot = lazy(() => import('./components/Chatbot'));
const StepDetails = lazy(() => import('./pages/StepDetails'));

function MainTimeline({ progressStep, location, user, loginWithGoogle, logout }) {
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

    return (
        <>
            <HeroSection location={location} user={user} loginWithGoogle={loginWithGoogle} logout={logout} />
            <Timeline progressStep={progressStep} />
        </>
    );
}

// Fallback loader for suspense
const Loader = () => (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', color: 'var(--primary)' }}>
        <span className="pulse" style={{ width: '24px', height: '24px' }}></span>
    </div>
);

function App() {
    // Custom hook handling all state persistence and geolocation
    const { location, progressStep, updateStep, user, loginWithGoogle, logout } = useElectionState();

    // Initialize Google Analytics on load (Google Services Requirement)
    useEffect(() => {
        const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-MOCK12345'; // Use env variable in prod
        initGA(gaMeasurementId);
    }, []);

    return (
        <Router>
            <div className="background-elements" aria-hidden="true">
                <div className="blob shape1"></div>
                <div className="blob shape2"></div>
            </div>

            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route path="/" element={<MainTimeline progressStep={progressStep} location={location} user={user} loginWithGoogle={loginWithGoogle} logout={logout} />} />
                    <Route path="/step/:id" element={<StepDetails location={location} />} />
                </Routes>
                
                <Chatbot 
                    location={location} 
                    progressStep={progressStep} 
                    updateStep={updateStep} 
                />
            </Suspense>
        </Router>
    );
}

export default App;
