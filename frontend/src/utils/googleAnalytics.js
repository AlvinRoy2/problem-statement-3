/**
 * Google Analytics 4 (GA4) Utility
 * Manages custom event tracking to measure problem statement alignment (usage of the AI and timeline steps).
 */

export const initGA = (measurementId) => {
    if (typeof window === 'undefined') return;

    // Load the GA4 script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize the dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
        window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
        send_page_view: true
    });
};

export const trackEvent = (eventName, eventParams = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, eventParams);
    } else {
        // Fallback for development / testing
        console.log(`[GA Mock] Event Logged: ${eventName}`, eventParams);
    }
};

export const trackStepCompletion = (stepId) => {
    trackEvent('election_step_completed', {
        step_id: stepId,
        step_name: getStepName(stepId)
    });
};

export const trackChatbotInteraction = (action) => {
    trackEvent('chatbot_used', {
        action: action // e.g. 'opened', 'sent_message', 'voice_used'
    });
};

const getStepName = (stepId) => {
    const names = {
        1: 'Voter Registration (EPIC)',
        2: 'Constituency & Candidate Research',
        3: 'Locate Polling Booth',
        4: 'Cast Vote via EVM/VVPAT'
    };
    return names[stepId] || 'Unknown Step';
};
