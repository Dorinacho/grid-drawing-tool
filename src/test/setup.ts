import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window properties for tests that use calculateCanvasDimensions
Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1920,
});

Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 1080,
});

// Mock localStorage for language tests
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});
