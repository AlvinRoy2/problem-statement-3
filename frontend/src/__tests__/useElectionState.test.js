import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useElectionState } from '../utils/useElectionState';
import * as apiService from '../utils/apiService';
import * as googleAnalytics from '../utils/googleAnalytics';

describe('useElectionState hook', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('initializes with default state when localStorage is empty', () => {
        const { result } = renderHook(() => useElectionState());
        expect(result.current.progressStep).toBe(0);
        expect(result.current.location).toBeNull();
    });

    it('loads state from localStorage if available', () => {
        localStorage.setItem('electionState', JSON.stringify({ progressStep: 2 }));
        const { result } = renderHook(() => useElectionState());
        expect(result.current.progressStep).toBe(2);
    });

    it('updates step and syncs to localStorage', () => {
        const trackSpy = vi.spyOn(googleAnalytics, 'trackStepCompletion').mockImplementation(() => {});
        const { result } = renderHook(() => useElectionState());

        act(() => {
            result.current.updateStep(1);
        });

        expect(result.current.progressStep).toBe(1);
        const stored = JSON.parse(localStorage.getItem('electionState'));
        expect(stored.progressStep).toBe(1);
        expect(trackSpy).toHaveBeenCalledWith(1);
    });

    it('fetches location on mount', async () => {
        const mockLocation = { city: 'Mumbai', region: 'Maharashtra' };
        vi.spyOn(apiService, 'detectLocation').mockResolvedValue(mockLocation);

        const { result } = renderHook(() => useElectionState());

        await act(async () => {
            // Allow the async detectLocation effect to settle
            await new Promise(resolve => setTimeout(resolve, 50));
        });

        expect(result.current.location).toEqual(mockLocation);
    });
});
