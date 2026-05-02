import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Timeline from '../components/Timeline';

const renderTimeline = (progressStep = 0) =>
    render(
        <MemoryRouter>
            <Timeline progressStep={progressStep} />
        </MemoryRouter>
    );

describe('Indian Timeline component', () => {
    it('renders all four Indian steps', () => {
        renderTimeline();
        expect(screen.getByText(/Voter Registration \(EPIC\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Constituency & Candidate Research/i)).toBeInTheDocument();
        expect(screen.getByText(/Locate Polling Booth/i)).toBeInTheDocument();
        expect(screen.getByText(/Cast Vote via EVM\/VVPAT/i)).toBeInTheDocument();
    });

    it('renders links on each step', () => {
        renderTimeline();
        // Updated text in Timeline.jsx: "Resources & EPIC Help →"
        const links = screen.getAllByText(/Resources & EPIC Help/i);
        expect(links).toHaveLength(4);
    });

    it('marks no steps as completed at step 0', () => {
        const { container } = renderTimeline(0);
        const items = container.querySelectorAll('.timeline-item.completed');
        expect(items).toHaveLength(0);
    });

    it('marks the first step as active when progressStep is 0', () => {
        const { container } = renderTimeline(0);
        const activeItems = container.querySelectorAll('.timeline-item.active');
        expect(activeItems).toHaveLength(1);
    });

    it('has correct ARIA labels on each step', () => {
        renderTimeline();
        expect(screen.getByLabelText(/Step 1: Voter Registration \(EPIC\)/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Step 4: Cast Vote via EVM\/VVPAT/i)).toBeInTheDocument();
    });
});
