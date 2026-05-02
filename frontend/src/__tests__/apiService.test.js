import { describe, it, expect, vi, beforeEach } from 'vitest';
import { debounce, sendChatMessage } from '../utils/apiService';

// ─── debounce ────────────────────────────────────────────────────────────────
describe('debounce()', () => {
    it('fires the function only once after multiple rapid calls', async () => {
        vi.useFakeTimers();
        const fn = vi.fn();
        const debounced = debounce(fn, 100);

        debounced();
        debounced();
        debounced();

        expect(fn).not.toHaveBeenCalled();
        vi.runAllTimers();
        expect(fn).toHaveBeenCalledTimes(1);
        vi.useRealTimers();
    });

    it('fires again after the wait period resets', async () => {
        vi.useFakeTimers();
        const fn = vi.fn();
        const debounced = debounce(fn, 100);

        debounced();
        vi.runAllTimers();
        debounced();
        vi.runAllTimers();

        expect(fn).toHaveBeenCalledTimes(2);
        vi.useRealTimers();
    });
});

// ─── sendChatMessage ──────────────────────────────────────────────────────────
describe('sendChatMessage()', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('returns reply and action from a successful API call', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ reply: 'Hello!', action: 'NONE', next_step: 0 }),
        });

        const result = await sendChatMessage('Hi', {}, 0);
        expect(result.reply).toBe('Hello!');
        expect(result.action).toBe('NONE');
    });

    it('returns a fallback message when the API call fails', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Trouble connecting to server'));

        const result = await sendChatMessage('Hi', {}, 0);
        // We now pass through the error message in some cases or use a generic one
        expect(result.reply).toMatch(/trouble connecting|Trouble connecting/i);
    });

    it('returns a fallback message when response is not ok', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            json: async () => ({ detail: 'API Error' }),
        });

        const result = await sendChatMessage('Hi', {}, 0);
        expect(result.reply).toBe('API Error');
    });
});
