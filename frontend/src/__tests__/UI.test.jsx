import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock dependencies
vi.mock('../utils/apiService', () => ({
    detectLocation: vi.fn(() => Promise.resolve({ city: 'New Delhi', region: 'Delhi', source: 'ip' })),
    sendChatMessage: vi.fn(),
    debounce: (f) => f,
}));

describe('Indian Election Buddy Integration Tests', () => {
    it('renders the Hero section with Indian messaging', async () => {
        render(<App />);
        expect(screen.getByText(/Your Vote, India's Future/i)).toBeDefined();
    });

    it('contains an ECI Search link', async () => {
        render(<App />);
        const searchLink = await screen.findByLabelText(/Find polling station in India/i);
        expect(searchLink).toBeDefined();
        expect(searchLink.getAttribute('href')).toContain('electoralsearch.eci.gov.in');
    });

    it('renders the Indian Election Timeline with four steps', () => {
        render(<App />);
        expect(screen.getByText(/Voter Registration \(EPIC\)/i)).toBeDefined();
        expect(screen.getByText(/Constituency & Candidate Research/i)).toBeDefined();
        expect(screen.getByText(/Locate Polling Booth/i)).toBeDefined();
        expect(screen.getByText(/Cast Vote via EVM\/VVPAT/i)).toBeDefined();
    });

    it('ensures accessibility with ARIA roles', () => {
        render(<App />);
        const banners = screen.getAllByRole('banner');
        expect(banners.length).toBeGreaterThan(0);
        expect(screen.getByRole('main')).toBeDefined();
    });
});
