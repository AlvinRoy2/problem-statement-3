import { useState, useEffect, useCallback } from 'react';
import { detectLocation } from './apiService';
import { trackStepCompletion } from './googleAnalytics';
import { auth, getUserProgress, saveUserProgress, loginWithGoogle, logout } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const STORAGE_KEY = 'electionState';

/**
 * Custom hook to manage the global election state including geolocation,
 * local storage persistence, and Firebase Firestore sync.
 */
export function useElectionState() {
    const [location, setLocation] = useState(null);
    const [user, setUser] = useState(null);
    const [progressStep, setProgressStep] = useState(() => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data).progressStep || 0 : 0;
        } catch (e) {
            return 0;
        }
    });

    // Firebase Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Fetch progress from Firestore when logged in
                const firestoreStep = await getUserProgress(currentUser.uid);
                if (firestoreStep > progressStep) {
                    setProgressStep(firestoreStep);
                }
            }
        });
        return () => unsubscribe();
    }, [progressStep]);

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

    // Persist state to local storage and Firestore whenever progress changes
    useEffect(() => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            const state = data ? JSON.parse(data) : {};
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, location, progressStep }));
            
            if (user) {
                saveUserProgress(user.uid, progressStep);
            }
        } catch (e) {
            console.error("Failed to save state:", e);
        }
    }, [location, progressStep, user]);

    // Update progress step and log analytics
    const updateStep = useCallback((newStep) => {
        setProgressStep((prevStep) => {
            if (newStep > prevStep) {
                trackStepCompletion(newStep);
            }
            return newStep;
        });
    }, []);

    return { location, progressStep, updateStep, user, loginWithGoogle, logout };
}
