import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import NotificationContext from '../../contexts/NotificationContext';
import useHandleError from '../../hooks/useHandleError';

vi.mock('axios', () => ({
    isAxiosError: vi.fn(() => false),
}));

function makeWrapper(notify: ReturnType<typeof vi.fn>) {
    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(NotificationContext.Provider, {
            value: {
                isOpen: false, notify, dismissNotification: vi.fn(),
                notifications: [], current: undefined,
                displacement: '8px', setDisplacement: vi.fn(),
            },
        }, children);
}

describe('useHandleError', () => {
    it('returns a callback function', () => {
        const { result } = renderHook(() => useHandleError(), { wrapper: makeWrapper(vi.fn()) });
        expect(typeof result.current).toBe('function');
    });

    it('calls notify with error message when given an Error', () => {
        const notify = vi.fn();
        const { result } = renderHook(() => useHandleError(), { wrapper: makeWrapper(notify) });
        result.current(new Error('something went wrong'));
        expect(notify).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'something went wrong', severity: 'error' })
        );
    });

    it('throws when given a non-Error value', () => {
        const notify = vi.fn();
        const { result } = renderHook(() => useHandleError(), { wrapper: makeWrapper(notify) });
        expect(() => result.current('not an error')).toThrow();
    });

    it('returns the same callback reference between renders (memoized)', () => {
        const notify = vi.fn();
        const { result, rerender } = renderHook(() => useHandleError(), { wrapper: makeWrapper(notify) });
        const first = result.current;
        rerender();
        expect(result.current).toBe(first);
    });
});
