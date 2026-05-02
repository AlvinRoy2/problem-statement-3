import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { trackEvent } from '../utils/googleAnalytics';

const STEP_META = {
    1: { image: '/step1.png', color: '#3b82f6', emoji: null },
    2: { image: '/step2.png', color: '#8b5cf6', emoji: null },
    3: { image: '/step3.png', color: '#ec4899', emoji: null },
    4: { image: null,        color: '#10b981', emoji: '🗳️' },
};

export default function StepDetails({ location }) {
    const { id } = useParams();
    const meta = STEP_META[id] || { color: '#3b82f6', image: null, emoji: '📋' };

    useEffect(() => {
        // Track page view for specific step
        trackEvent('view_step_details', { step_id: id });
    }, [id]);

    const handleLinkClick = (linkName) => {
        trackEvent('external_link_click', { link_name: linkName });
    };

    const stepData = {
        1: {
            title: "Voter Registration Guide (EPIC)",
            content: (
                <>
                    {location?.region && location.region !== "Unknown" && (
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                            <strong>📍 Location Detected:</strong> You appear to be in <strong>{location.region}</strong>. Make sure your name is registered in the Electoral Roll of your constituency in {location.region}.
                        </div>
                    )}
                    
                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Where to Start</h3>
                    <p>The most direct way to begin is by visiting the official National Voters' Service Portal (NVSP) or the Voters' Service Portal of the Election Commission of India (ECI).</p>
                    <a href="https://voters.eci.gov.in/" target="_blank" rel="noreferrer" onClick={() => handleLinkClick('NVSP_Portal')} className="btn primary-btn" style={{marginTop: '10px', marginBottom: '20px', display: 'inline-block'}}>
                        Register at ECI Portal
                    </a>
                    
                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Methods of Registration</h3>
                    <ul>
                        <li style={{marginBottom: '10px'}}><strong>Online:</strong> Fill Form 6 online via the Voters' Service Portal or the Voter Helpline App.</li>
                        <li style={{marginBottom: '10px'}}><strong>Offline:</strong> Download and print Form 6, fill it out, and submit it to the Electoral Registration Officer (ERO) or Booth Level Officer (BLO) of your area.</li>
                    </ul>

                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Important Documents Required</h3>
                    <ul>
                        <li style={{marginBottom: '10px'}}><strong>Age Proof:</strong> Birth Certificate, Aadhaar Card, PAN Card, or 10th Class Marksheet.</li>
                        <li style={{marginBottom: '10px'}}><strong>Address Proof:</strong> Aadhaar Card, Passport, Ration Card, or latest Utility Bill.</li>
                    </ul>
                </>
            )
        },
        2: {
            title: "Constituency & Candidate Research",
            content: (
                <>
                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Identify Your Constituency</h3>
                    <p>Before heading to the polls, know your Lok Sabha and Vidhan Sabha constituency. You can check these details on the ECI Electoral Search portal using your EPIC number.</p>
                    
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px', marginBottom: '20px' }}>
                        <a href="https://electoralsearch.eci.gov.in/" target="_blank" rel="noreferrer" onClick={() => handleLinkClick('ECI_Electoral_Search')} className="btn primary-btn" style={{background: '#333', boxShadow: 'none'}}>
                            ECI Electoral Search
                        </a>
                    </div>
                    
                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Researching Candidates</h3>
                    <ul>
                        <li style={{marginBottom: '10px'}}><strong>Know Your Candidate (KYC) App:</strong> The ECI provides the KYC App where you can see the criminal antecedents and affidavits of all candidates.</li>
                        <li style={{marginBottom: '10px'}}><strong>Affidavits:</strong> Read the official affidavits filed by candidates during nomination to understand their assets, liabilities, and educational background.</li>
                    </ul>
                </>
            )
        },
        3: {
            title: "Locate Polling Booth",
            content: (
                <>
                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Find Your Designated Booth</h3>
                    <p>You can only vote at the designated polling station for your part of the electoral roll. Check your polling booth slip or search online.</p>
                    
                    <a href="https://electoralsearch.eci.gov.in/" target="_blank" rel="noreferrer" onClick={() => handleLinkClick('Find_Polling_Booth')} className="btn primary-btn" style={{marginTop: '10px', marginBottom: '20px', display: 'inline-block'}}>
                        Search Polling Station
                    </a>
                    
                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Locate on Map</h3>
                    <p>Use the map below to search for nearby polling stations or government schools (which often serve as booths).</p>
                    
                    {/* Google Maps Embed — searches for polling places near user */}
                    <div style={{marginTop: '15px', marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)'}}>
                        <iframe
                            title="Google Maps — Find Polling Places Near You"
                            width="100%"
                            height="350"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps/embed/v1/search?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}&q=government+school+or+polling+booth+near+${encodeURIComponent(location?.city || location?.region || 'me')}`}
                            style={{border: 0, display: 'block'}}
                            aria-label="Google Maps showing polling places nearby"
                        />
                    </div>
                </>
            )
        },
        4: {
            title: "Cast Vote via EVM/VVPAT",
            content: (
                <>
                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>What to carry</h3>
                    <p>Bring your EPIC card (Voter ID). If you don't have it, ECI allows alternative photo IDs like Aadhaar, PAN Card, Driving License, or Passport, provided your name is on the electoral roll.</p>
                    
                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Using the EVM & VVPAT</h3>
                    <ul>
                        <li style={{marginBottom: '10px'}}>Press the blue button against the name and symbol of your chosen candidate.</li>
                        <li style={{marginBottom: '10px'}}>You will hear a long beep sound confirming your vote.</li>
                        <li style={{marginBottom: '10px'}}>Check the VVPAT machine. A slip will appear behind the glass window for 7 seconds showing the serial number, name, and symbol of the candidate you voted for.</li>
                    </ul>
                    
                    <div style={{ background: 'rgba(236, 72, 153, 0.1)', borderLeft: '4px solid var(--accent-secondary)', padding: '15px', marginTop: '20px' }}>
                        <strong>💡 Know Your Rights:</strong> As long as you are in line when the polls close, you have the legal right to stay in line and cast your ballot. Do not leave the line!
                    </div>
                </>
            )
        }
    };

    const step = stepData[id];

    if (!step) {
        return (
            <div className="container" style={{paddingTop: '150px'}}>
                <div className="glass-panel" style={{padding: '40px', textAlign: 'center'}}>
                    <h2>Step not found.</h2>
                    <Link to="/#timeline-section" className="btn primary-btn" style={{marginTop: '20px'}}>Back to Timeline</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{paddingTop: '120px', paddingBottom: '100px'}}>
            <Link
                to="/#timeline-section"
                className="step-back-link"
                aria-label="Back to Voting Timeline"
            >
                <span aria-hidden="true">←</span> Back to Timeline
            </Link>

            <div className="step-hero glass-panel" style={{ borderTop: `4px solid ${meta.color}` }}>
                {meta.image ? (
                    <img
                        src={meta.image}
                        alt={`Illustration for ${step.title}`}
                        className="step-hero-img"
                        loading="eager"
                    />
                ) : (
                    <div className="step-hero-emoji" style={{ background: `${meta.color}22`, color: meta.color }}>
                        {meta.emoji}
                    </div>
                )}
                <div className="step-hero-body">
                    <div className="step-number-badge" style={{ background: `${meta.color}22`, color: meta.color, border: `1px solid ${meta.color}55` }}>
                        Step {id} of 4
                    </div>
                    <h1 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', margin: '10px 0' }}>{step.title}</h1>
                </div>
            </div>

            <div className="glass-panel step-content-panel">
                <div style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.9' }}>
                    {step.content}
                </div>
            </div>
        </div>
    );
}
