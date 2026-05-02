import React from 'react';
import { Link } from 'react-router-dom';

const steps = [
    {
        id: 1,
        title: 'Voter Registration (EPIC)',
        description: "Register on the NVSP portal or through the Voter Helpline App to get your EPIC card and name in the roll.",
        timeEstimate: '10-15 mins',
        image: '/step1.png',
        imageAlt: 'Voter registration on NVSP portal',
        color: 'hsl(25, 95%, 55%)', // Saffron
    },
    {
        id: 2,
        title: 'Constituency & Candidate Research',
        description: 'Find your constituency and research candidates in your Lok Sabha or Vidhan Sabha area using ECI resources.',
        timeEstimate: '20-30 mins',
        image: '/step2.png',
        imageAlt: 'Researching election candidates in India',
        color: 'hsl(215, 80%, 50%)', // Blue (Ashoka Chakra color)
    },
    {
        id: 3,
        title: 'Locate Polling Booth',
        description: 'Check your name in the Electoral Roll and find your designated polling station (Booth) in your locality.',
        timeEstimate: '5-10 mins',
        image: '/step3.png',
        imageAlt: 'Locating a polling station in India',
        color: 'hsl(145, 60%, 45%)', // Green
    },
    {
        id: 4,
        title: 'Cast Vote via EVM/VVPAT',
        description: 'The final step. Visit your polling booth, get your finger inked, and cast your vote using the EVM and VVPAT.',
        timeEstimate: '30-60 mins',
        image: null,
        imageAlt: null,
        color: 'hsl(0, 0%, 50%)', // Gray/Neutral
        emoji: '🇮🇳',
    },
];

export default function Timeline({ progressStep }) {
    return (
        <main id="timeline-section" className="container" role="main">
            <header className="timeline-header">
                <h2 className="section-title">Indian Election Progress Tracker</h2>
                <p className="section-subtitle" style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '-60px', marginBottom: '80px', fontSize: '1.2rem' }}>
                    A step-by-step guide to participating in the world's largest democracy.
                </p>
            </header>
            
            <div className="timeline" role="list">
                {steps.map((step, index) => {
                    let className = 'timeline-item visible';
                    let isCompleted = index < progressStep;
                    let isActive = index === progressStep;
                    
                    if (isCompleted) className += ' completed';
                    else if (isActive) className += ' active';

                    return (
                        <div
                            key={step.id}
                            className={className}
                            id={`step-${step.id}`}
                            role="listitem"
                            tabIndex="0"
                            aria-label={`Step ${step.id}: ${step.title}. ${isCompleted ? 'Completed' : isActive ? 'Current Step' : 'Upcoming Step'}`}
                        >
                            <div className="timeline-dot" style={{ borderColor: step.color, color: isActive || isCompleted ? '#fff' : step.color }}>
                                {isCompleted ? '✓' : step.id}
                            </div>
                            <Link to={`/step/${step.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                                <div className="timeline-content glass-panel timeline-card">
                                    <div className="timeline-card-image-wrap">
                                        {step.image ? (
                                            <img
                                                src={step.image}
                                                alt={step.imageAlt}
                                                className="timeline-card-image"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div
                                                className="timeline-card-emoji"
                                                aria-hidden="true"
                                                style={{ background: `${step.color}22`, borderColor: `${step.color}55` }}
                                            >
                                                {step.emoji}
                                            </div>
                                        )}
                                        {isCompleted && (
                                            <div className="completed-badge" aria-label="Completed">Done</div>
                                        )}
                                    </div>
                                    <div className="timeline-card-body">
                                        <div className="step-meta" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span className="step-number" style={{ color: step.color, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Step {step.id}</span>
                                            <span className="step-time" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>⏱ {step.timeEstimate}</span>
                                        </div>
                                        <h3 style={{ color: isActive ? '#fff' : isCompleted ? 'var(--text-secondary)' : '#fff' }}>{step.title}</h3>
                                        <p style={{ opacity: isCompleted ? 0.7 : 1 }}>{step.description}</p>
                                        <span className="read-more-link" style={{ color: step.color, marginTop: 'auto' }}>
                                            Resources & EPIC Help →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
