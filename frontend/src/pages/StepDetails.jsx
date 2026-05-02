import React from 'react';
import { useParams, Link } from 'react-router-dom';

const STEP_META = {
    1: { image: '/step1.png', color: '#3b82f6', emoji: null },
    2: { image: '/step2.png', color: '#8b5cf6', emoji: null },
    3: { image: '/step3.png', color: '#ec4899', emoji: null },
    4: { image: null,        color: '#10b981', emoji: '🗳️' },
};

const getActionLinks = (location) => {
    const region = location?.region;
    const voteGovLink = region && region !== "Unknown"
        ? `https://vote.gov/register/${region.toLowerCase().replace(/\s+/g, '-')}` 
        : 'https://vote.gov/';
    return { voteGovLink };
};

export default function StepDetails({ location }) {
    const { id } = useParams();
    const { voteGovLink } = getActionLinks(location);
    const meta = STEP_META[id] || { color: '#3b82f6', image: null, emoji: '📋' };

    const stepData = {
        1: {
            title: "Voter Registration Guide",
            content: (
                <>
                    {location?.region && location.region !== "Unknown" && (
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                            <strong>📍 Location Detected:</strong> You appear to be in <strong>{location.region}</strong>. Registration rules vary by state, so be sure to check the specific guidelines for {location.region}.
                        </div>
                    )}
                    
                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Where to Start</h3>
                    <p>The most direct way to begin is by visiting the official U.S. government portal. It will direct you to your state's exact registration site.</p>
                    <a href={voteGovLink} target="_blank" rel="noreferrer" className="btn primary-btn" style={{marginTop: '10px', marginBottom: '20px', display: 'inline-block'}}>
                        Register at Vote.gov
                    </a>
                    
                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Methods of Registration</h3>
                    <ul>
                        <li style={{marginBottom: '10px'}}><strong>Online:</strong> Many states allow you to register online using a driver's license or state-issued ID.</li>
                        <li style={{marginBottom: '10px'}}><strong>By Mail:</strong> You can download, print, and sign the National Mail Voter Registration Form, then mail it to your state election office.</li>
                        <li style={{marginBottom: '10px'}}><strong>In-Person:</strong> Register at local election offices, the DMV, or public assistance agencies.</li>
                    </ul>

                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Important Considerations</h3>
                    <ul>
                        <li style={{marginBottom: '10px'}}><strong>Deadlines:</strong> Every state has its own deadline. Ensure you register or postmark your mail well before Election Day.</li>
                        <li style={{marginBottom: '10px'}}><strong>Documents Ready:</strong> Most states require proof of identity like a driver's license. If you lack one, utility bills or bank statements may be accepted depending on your location.</li>
                    </ul>
                    
                    <div style={{ background: 'rgba(236, 72, 153, 0.1)', borderLeft: '4px solid var(--accent-secondary)', padding: '15px', marginTop: '20px' }}>
                        <strong>💡 Pro-Tip for College Students:</strong> You generally have the right to choose whether to register at your home address or your campus address. Choose the location where you consider yourself a resident!
                    </div>
                </>
            )
        },
        2: {
            title: "Candidate & Measure Research",
            content: (
                <>
                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Identify What Is on Your Ballot</h3>
                    <p>Before heading to the polls, know who and what you are voting on. You can usually find a sample ballot on your local election office's website or use powerful nonpartisan tools to generate a custom ballot based on your exact address.</p>
                    
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px', marginBottom: '20px' }}>
                        <a href="https://ballotpedia.org/Sample_Ballot_Lookup" target="_blank" rel="noreferrer" className="btn primary-btn" style={{background: '#333', boxShadow: 'none'}}>
                            Ballotpedia Lookup
                        </a>
                        <a href="https://www.vote411.org/ballot" target="_blank" rel="noreferrer" className="btn primary-btn" style={{background: '#d32f2f', boxShadow: 'none'}}>
                            VOTE411 Guide
                        </a>
                    </div>
                    
                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Deep Dive into Candidates</h3>
                    <ul>
                        <li style={{marginBottom: '10px'}}><strong>Official Websites:</strong> Read their platforms and policy priorities directly from the source.</li>
                        <li style={{marginBottom: '10px'}}><strong>Voting Records & Experience:</strong> Review what incumbents have actually done in office, not just what they say.</li>
                        <li style={{marginBottom: '10px'}}><strong>Endorsements & Finance:</strong> Look at who supports them. Check out <a href="https://www.opensecrets.org/" target="_blank" rel="noreferrer" style={{color: 'var(--accent-primary)'}}>OpenSecrets</a> to see campaign donors and potential influences.</li>
                    </ul>

                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Understand Ballot Measures</h3>
                    <p>Ballot measures can be complex and sometimes misleadingly worded. Always look for nonpartisan summaries that clearly explain the pros, cons, and actual real-world impact of a "yes" or "no" vote.</p>
                </>
            )
        },
        3: {
            title: "Choosing How to Vote",
            content: (
                <>
                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Mail-in or Absentee Voting</h3>
                    <p>If you prefer to vote by mail, check your state's laws. Some states require an "excuse" (like being out of state or having an illness), while others offer no-excuse absentee voting. Always request your ballot early and follow return instructions carefully.</p>
                    
                    <a href="https://www.vote.org/absentee-ballot/" target="_blank" rel="noreferrer" className="btn primary-btn" style={{marginTop: '10px', marginBottom: '20px', display: 'inline-block'}}>
                        Request Absentee Ballot
                    </a>
                    
                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Early Voting</h3>
                    <p>Many states offer early in-person voting. This is a great way to avoid long lines on Election Day. Check your local election office for early voting dates, times, and locations, as they often differ from Election Day polling places.</p>
                    
                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Election Day Voting</h3>
                    <p>If you plan to vote on the designated Election Day, verify your polling place assignment and hours. Arrive prepared with any necessary identification.</p>
                    
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderLeft: '4px solid var(--accent-primary)', padding: '15px', marginTop: '20px' }}>
                        <strong>💡 Pro-Tip:</strong> If you are voting by mail, make sure you sign the envelope exactly as you signed your voter registration card. Signature mismatch is a common reason mail-in ballots are rejected.
                    </div>
                </>
            )
        },
        4: {
            title: "What to Know Before Casting Your Ballot",
            content: (
                <>
                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Voter Identification Requirements</h3>
                    <p>Voter ID laws vary drastically by state. Some require strict government-issued photo ID, while others require no ID at all. <strong>Always verify your state's specific requirements before heading out.</strong></p>
                    
                    <a href="https://www.vote.org/voter-id-laws/" target="_blank" rel="noreferrer" className="btn primary-btn" style={{marginTop: '10px', marginBottom: '20px', display: 'inline-block', background: '#eab308', color: '#000', boxShadow: 'none'}}>
                        Check ID Requirements
                    </a>
                    
                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Find Polling Places Near You</h3>
                    <p>You are assigned a specific polling place based on your address. Use the map below to search for polling locations near you, or visit your state's official election website to confirm your assigned precinct.</p>
                    
                    {/* Google Maps Embed — searches for polling places near user */}
                    <div style={{marginTop: '15px', marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)'}}>
                        <iframe
                            title="Google Maps — Find Polling Places Near You"
                            width="100%"
                            height="350"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps/embed/v1/search?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}&q=polling+place+near+${encodeURIComponent(location?.city || location?.region || 'me')}`}
                            style={{border: 0, display: 'block'}}
                            aria-label="Google Maps showing polling places nearby"
                        />
                    </div>

                    <a href="https://www.vote.org/polling-place-locator/" target="_blank" rel="noreferrer" className="btn primary-btn" style={{marginTop: '0px', marginBottom: '20px', display: 'inline-block'}}>
                        Official Polling Place Locator
                    </a>

                    <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Provisional Ballots</h3>
                    <p>If you forget your ID or if your name isn't on the roster, you have the federal right to cast a provisional ballot. These are kept separate and counted once election officials verify your eligibility.</p>
                    
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
            {/* Back Link */}
            <Link
                to="/#timeline-section"
                className="step-back-link"
                aria-label="Back to Voting Timeline"
            >
                <span aria-hidden="true">←</span> Back to Timeline
            </Link>

            {/* Page hero banner with step image */}
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

            {/* Content panel */}
            <div className="glass-panel step-content-panel">
                <div style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.9' }}>
                    {step.content}
                </div>
            </div>
        </div>
    );
}
