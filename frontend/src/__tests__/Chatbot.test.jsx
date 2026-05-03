import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Chatbot from '../components/Chatbot';
import * as apiService from '../utils/apiService';
import * as googleAnalytics from '../utils/googleAnalytics';

vi.mock('../utils/apiService', () => ({
    sendChatMessage: vi.fn()
}));

vi.mock('../utils/googleAnalytics', () => ({
    trackChatbotInteraction: vi.fn()
}));

describe('Chatbot Component', () => {
    it('renders closed initially and toggles open', () => {
        const { container } = render(<Chatbot progressStep={0} updateStep={vi.fn()} />);
        
        const toggleBtn = screen.getByLabelText('Open Election Chatbot');
        expect(toggleBtn).toBeInTheDocument();
        
        // Chatbot window is initially hidden via class
        const chatWindow = container.querySelector('.chat-window');
        expect(chatWindow).toHaveClass('hidden');

        // Toggle open
        fireEvent.click(toggleBtn);
        expect(chatWindow).not.toHaveClass('hidden');
        expect(googleAnalytics.trackChatbotInteraction).toHaveBeenCalledWith('chat_opened');
    });

    it('displays suggestions based on progress step', () => {
        render(<Chatbot progressStep={1} updateStep={vi.fn()} />);
        expect(screen.getByText("Who's on my ballot?")).toBeInTheDocument();
    });

    it('sends a message and handles response', async () => {
        apiService.sendChatMessage.mockResolvedValue({
            reply: "Mocked AI Response",
            action: null
        });

        render(<Chatbot progressStep={0} updateStep={vi.fn()} />);
        fireEvent.click(screen.getByLabelText('Open Election Chatbot'));

        const input = screen.getByPlaceholderText('Ask about deadlines...');
        const sendBtn = screen.getByLabelText('Send message');

        fireEvent.change(input, { target: { value: 'Test message' } });
        fireEvent.click(sendBtn);

        expect(googleAnalytics.trackChatbotInteraction).toHaveBeenCalledWith('message_sent');
        expect(screen.getByText('Test message')).toBeInTheDocument();

        // Wait for AI response (there is an 800ms artificial delay in Chatbot component + 500ms debounce)
        await waitFor(() => {
            expect(screen.getByText('Mocked AI Response')).toBeInTheDocument();
        }, { timeout: 2500 });
    });
});
