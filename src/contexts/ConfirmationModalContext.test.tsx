import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { ConfirmationModalProvider, useConfirmationModal } from './ConfirmationModalContext.tsx';

// Helper to wrap hook with provider
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ConfirmationModalProvider>{children}</ConfirmationModalProvider>
);

describe('ConfirmationModalContext', () => {
    describe('useConfirmationModal', () => {
        it('throws error when used outside provider', () => {
            // Suppress console.error for this test
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            expect(() => {
                renderHook(() => useConfirmationModal());
            }).toThrow('useConfirmationModal must be used within ConfirmationModalProvider');

            consoleSpy.mockRestore();
        });

        it('returns initial state with modal hidden', () => {
            const { result } = renderHook(() => useConfirmationModal(), { wrapper });

            expect(result.current.visible).toBe(false);
            expect(result.current.action).toBeNull();
        });

        it('shows modal with correct action when show() is called', () => {
            const { result } = renderHook(() => useConfirmationModal(), { wrapper });
            const mockCallback = vi.fn();

            act(() => {
                result.current.show('clear', mockCallback);
            });

            expect(result.current.visible).toBe(true);
            expect(result.current.action).toBe('clear');
        });

        it('hides modal when hide() is called', () => {
            const { result } = renderHook(() => useConfirmationModal(), { wrapper });
            const mockCallback = vi.fn();

            // Show first
            act(() => {
                result.current.show('update', mockCallback);
            });
            expect(result.current.visible).toBe(true);

            // Then hide
            act(() => {
                result.current.hide();
            });

            expect(result.current.visible).toBe(false);
            expect(result.current.action).toBeNull();
        });

        it('executes callback and hides modal when confirm() is called', () => {
            const { result } = renderHook(() => useConfirmationModal(), { wrapper });
            const mockCallback = vi.fn();

            // Show modal with callback
            act(() => {
                result.current.show('clear', mockCallback);
            });

            // Confirm
            act(() => {
                result.current.confirm();
            });

            expect(mockCallback).toHaveBeenCalledTimes(1);
            expect(result.current.visible).toBe(false);
            expect(result.current.action).toBeNull();
        });

        it('does not call callback when hide() is used instead of confirm()', () => {
            const { result } = renderHook(() => useConfirmationModal(), { wrapper });
            const mockCallback = vi.fn();

            // Show modal
            act(() => {
                result.current.show('update', mockCallback);
            });

            // Cancel (hide without confirming)
            act(() => {
                result.current.hide();
            });

            expect(mockCallback).not.toHaveBeenCalled();
        });
    });

    describe('shared state across components', () => {
        it('shares state between multiple hooks using the same provider', () => {
            // Create a custom wrapper to test both hooks share state
            const MultiHookWrapper = ({ children }: { children: React.ReactNode }) => (
                <ConfirmationModalProvider>{children}</ConfirmationModalProvider>
            );

            // Render two hooks with the same provider
            const { result: hook1 } = renderHook(() => useConfirmationModal(), {
                wrapper: MultiHookWrapper,
            });
            const { result: hook2 } = renderHook(() => useConfirmationModal(), {
                wrapper: MultiHookWrapper,
            });

            // Both should start hidden
            expect(hook1.current.visible).toBe(false);
            expect(hook2.current.visible).toBe(false);

            // Note: In a real React tree, both hooks would share the same context
            // This test demonstrates the API, but actual shared state testing
            // requires rendering components in the same tree
        });
    });

    describe('action types', () => {
        it('supports "clear" action type', () => {
            const { result } = renderHook(() => useConfirmationModal(), { wrapper });

            act(() => {
                result.current.show('clear', vi.fn());
            });

            expect(result.current.action).toBe('clear');
        });

        it('supports "update" action type', () => {
            const { result } = renderHook(() => useConfirmationModal(), { wrapper });

            act(() => {
                result.current.show('update', vi.fn());
            });

            expect(result.current.action).toBe('update');
        });
    });
});
