/**
 * API Service for Election Buddy
 * Includes timeouts, location detection, and chat communication.
 */

const FETCH_TIMEOUT = 10000; // 10 seconds

/**
 * Enhanced fetch with timeout support
 */
async function fetchWithTimeout(resource, options = {}) {
    const { timeout = FETCH_TIMEOUT } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

export async function detectLocation() {
    return new Promise((resolve) => {
        if (typeof navigator !== 'undefined' && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                        source: 'gps'
                    });
                },
                async () => {
                    resolve(await getIpLocation());
                },
                { timeout: 5000 }
            );
        } else {
            getIpLocation().then(resolve);
        }
    });
}

async function getIpLocation() {
    try {
        const response = await fetchWithTimeout('https://ipapi.co/json/');
        const data = await response.json();
        return {
            city: data.city,
            region: data.region,
            country: data.country_name,
            source: 'ip'
        };
    } catch (e) {
        console.warn("Location detection failed, using fallback.");
        return { city: "Unknown", region: "Unknown", source: 'fallback' };
    }
}

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export async function sendChatMessage(message, contextData, step) {
    try {
        const response = await fetchWithTimeout('/api/chat', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                message: message, 
                context: contextData,
                progress_step: step
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'API Error');
        }
        
        return await response.json();
        
    } catch (e) {
        if (e.name === 'AbortError') {
            return { reply: "The request timed out. My AI brain is taking a bit too long today!" };
        }
        console.error("Chat Error:", e.message);
        return { reply: e.message || "I'm having trouble connecting. Please check your network." };
    }
}
