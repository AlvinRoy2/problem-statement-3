import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

// Mock dependencies
vi.mock('../utils/apiService', () => ({
    detectLocation: vi.fn(() => Promise.resolve({ city: 'New Delhi', region: 'Delhi', source: 'ip' })),
    sendChatMessage: vi.fn(),
    debounce: (f) => f,
}));

vi.mock('../utils/googleAnalytics', () => ({
    trackStepCompletion: vi.fn(),
    trackChatbotInteraction: vi.fn(),
    initGA: vi.fn()
}));

describe('Indian Election Buddy Integration Tests', () => {
    it('renders the Hero section with Indian messaging', async () => {
        render(<App />);
        expect(await screen.findByText(/Your Vote, India's Future/i)).toBeDefined();
    });

    it('contains an ECI Search link', async () => {
        render(<App />);
        const searchLink = await screen.findByLabelText(/Find polling station in India/i);
        expect(searchLink).toBeDefined();
        expect(searchLink.getAttribute('href')).toContain('electoralsearch.eci.gov.in');
    });

    it('renders the Indian Election Timeline with four steps', async () => {
        render(<App />);
        expect(await screen.findByText(/Voter Registration \(EPIC\)/i)).toBeDefined();
        expect(await screen.findByText(/Constituency & Candidate Research/i)).toBeDefined();
        expect(await screen.findByText(/Locate Polling Booth/i)).toBeDefined();
        expect(await screen.findByText(/Cast Vote via EVM\/VVPAT/i)).toBeDefined();
    });

    it('ensures accessibility with ARIA roles', async () => {
        render(<App />);
        // Wait for main container to load to ensure lazy loading is done
        await screen.findByRole('main');
        const banners = screen.getAllByRole('banner');
        expect(banners.length).toBeGreaterThan(0);
    });
});
