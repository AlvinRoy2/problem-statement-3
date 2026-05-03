import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import * as apiService from '../utils/apiService';
import * as firebaseUtils from '../utils/firebase';

// Mock dependencies
vi.mock('../utils/apiService', () => ({
    sendChatMessage: vi.fn(),
    detectLocation: vi.fn()
}));

vi.mock('../utils/firebase', () => ({
    auth: {},
    getUserProgress: vi.fn(),
    saveUserProgress: vi.fn(),
    loginWithGoogle: vi.fn(),
    logout: vi.fn()
}));

vi.mock('firebase/auth', () => ({
    onAuthStateChanged: vi.fn((auth, callback) => {
        // Immediately invoke with a mock user
        callback({ uid: 'mock-user-123', displayName: 'Test User' });
        return vi.fn(); // unsubscribe mock
    })
}));

describe('Complete App Workflow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        apiService.detectLocation.mockResolvedValue({ city: 'Test City', region: 'Test Region' });
        firebaseUtils.getUserProgress.mockResolvedValue(1); // Mock user returning at step 1
    });

    it('loads app, syncs user state, and interacts with chatbot', async () => {
        apiService.sendChatMessage.mockResolvedValue({
            reply: "Mocked AI Response updating to step 2",
            action: "UPDATE_STEP",
            next_step: 2
        });

        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        // Verify Firebase Auth loaded
        await waitFor(() => {
            expect(screen.getByText('Hello, Test User')).toBeInTheDocument();
        });

        // Open Chatbot
        const toggleBtn = screen.getByLabelText('Open Election Chatbot');
        fireEvent.click(toggleBtn);

        // Send a message
        const input = screen.getByPlaceholderText('Ask about deadlines...');
        const sendBtn = screen.getByLabelText('Send message');
        
        fireEvent.change(input, { target: { value: 'Finished my research' } });
        fireEvent.click(sendBtn);

        // Verify AI Response and State Update
        await waitFor(() => {
            expect(screen.getByText('Mocked AI Response updating to step 2')).toBeInTheDocument();
        }, { timeout: 2500 });

        // Verify that progress was saved to Firestore
        expect(firebaseUtils.saveUserProgress).toHaveBeenCalledWith('mock-user-123', 2);
    });
});
