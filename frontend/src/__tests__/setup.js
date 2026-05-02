import '@testing-library/jest-dom';

// Mock window.scrollTo
window.scrollTo = vi.fn();
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock SpeechRecognition
class MockSpeechRecognition {
    constructor() {
        this.start = vi.fn();
        this.stop = vi.fn();
        this.onstart = null;
        this.onresult = null;
        this.onerror = null;
        this.onend = null;
    }
}
window.SpeechRecognition = MockSpeechRecognition;
window.webkitSpeechRecognition = MockSpeechRecognition;

// Mock import.meta.env
Object.defineProperty(import.meta, 'env', {
    value: {
        VITE_GA_MEASUREMENT_ID: 'G-TEST',
        VITE_GOOGLE_MAPS_API_KEY: 'TEST_KEY'
    }
});
