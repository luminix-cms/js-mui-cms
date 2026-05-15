import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import useKeyPress from '../../hooks/useKeyPress';

function fireKeyDown(key: string) {
    window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

function fireKeyUp(key: string) {
    window.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
}

describe('useKeyPress', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('returns false initially', () => {
        const { result } = renderHook(() => useKeyPress('Enter'));
        expect(result.current).toBe(false);
    });

    it('returns true when the configured key is pressed', () => {
        const { result } = renderHook(() => useKeyPress('Enter'));
        act(() => {
            fireKeyDown('Enter');
        });
        expect(result.current).toBe(true);
    });

    it('returns false after the key is released', () => {
        const { result } = renderHook(() => useKeyPress('Enter'));
        act(() => {
            fireKeyDown('Enter');
        });
        act(() => {
            fireKeyUp('Enter');
        });
        expect(result.current).toBe(false);
    });

    it('calls onPress callback when the key is pressed', () => {
        const onPress = vi.fn();
        renderHook(() => useKeyPress('a', onPress));
        act(() => {
            fireKeyDown('a');
        });
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress for a different key', () => {
        const onPress = vi.fn();
        renderHook(() => useKeyPress('a', onPress));
        act(() => {
            fireKeyDown('b');
        });
        expect(onPress).not.toHaveBeenCalled();
    });

    it('ignores keydown events for different keys', () => {
        const { result } = renderHook(() => useKeyPress('a'));
        act(() => {
            fireKeyDown('b');
        });
        expect(result.current).toBe(false);
    });

    it('removes event listeners on unmount', () => {
        const addSpy = vi.spyOn(window, 'addEventListener');
        const removeSpy = vi.spyOn(window, 'removeEventListener');

        const { unmount } = renderHook(() => useKeyPress('Escape'));
        expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
        expect(addSpy).toHaveBeenCalledWith('keyup', expect.any(Function));

        unmount();

        expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
        expect(removeSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
    });
});
