import { useState, useEffect, useCallback } from 'react';
import { detectLocation } from './apiService';
import { trackStepCompletion } from './googleAnalytics';

const STORAGE_KEY = 'electionState';

/**
 * Custom hook to manage the global election state including geolocation
 * and local storage persistence.
 */
export function useElectionState() {
    const [location, setLocation] = useState(null);
    const [progressStep, setProgressStep] = useState(() => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data).progressStep || 0 : 0;
        } catch (e) {
            return 0;
        }
    });

    // Fetch user location once on mount
    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const loc = await detectLocation();
                setLocation(loc);
            } catch (error) {
                console.error("Failed to detect location:", error);
            }
        };
        fetchLocation();
    }, []);

    // Persist state to local storage whenever progress or location changes
    useEffect(() => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            const state = data ? JSON.parse(data) : {};
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, location, progressStep }));
        } catch (e) {
            console.error("Failed to save state to localStorage:", e);
        }
    }, [location, progressStep]);

    // Update progress step and log analytics
    const updateStep = useCallback((newStep) => {
        setProgressStep((prevStep) => {
            if (newStep > prevStep) {
                // Track progress in Google Analytics
                trackStepCompletion(newStep);
            }
            return newStep;
        });
        
        // Immediate sync to localStorage for reliability
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            const state = data ? JSON.parse(data) : {};
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, progressStep: newStep }));
        } catch (e) {}
    }, []);

    return { location, progressStep, updateStep };
}
