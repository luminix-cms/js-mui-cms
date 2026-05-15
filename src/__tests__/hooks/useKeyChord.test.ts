import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import useKeyChord from '../../hooks/useKeyChord';

function fireKeyDown(key: string) {
    window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

function fireKeyUp(key: string) {
    window.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
}

describe('useKeyChord', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('returns false initially', () => {
        const { result } = renderHook(() => useKeyChord(['Control', '/']));
        expect(result.current).toBe(false);
    });

    it('returns false when only part of the chord is pressed', () => {
        const { result } = renderHook(() => useKeyChord(['Control', '/']));
        act(() => {
            fireKeyDown('Control');
        });
        expect(result.current).toBe(false);
    });

    it('returns true when all keys of the chord are pressed', () => {
        const { result } = renderHook(() => useKeyChord(['Control', '/']));
        act(() => {
            fireKeyDown('Control');
            fireKeyDown('/');
        });
        expect(result.current).toBe(true);
    });

    it('returns false when any key of the chord is released', () => {
        const { result } = renderHook(() => useKeyChord(['Control', '/']));
        act(() => {
            fireKeyDown('Control');
            fireKeyDown('/');
        });
        act(() => {
            fireKeyUp('Control');
        });
        expect(result.current).toBe(false);
    });

    it('calls onPress when the full chord is completed', () => {
        const onPress = vi.fn();
        renderHook(() => useKeyChord(['Control', '/'], onPress));
        act(() => {
            fireKeyDown('Control');
            fireKeyDown('/');
        });
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when only part of the chord is pressed', () => {
        const onPress = vi.fn();
        renderHook(() => useKeyChord(['Control', '/'], onPress));
        act(() => {
            fireKeyDown('Control');
        });
        expect(onPress).not.toHaveBeenCalled();
    });

    it('handles single-key chord', () => {
        const { result } = renderHook(() => useKeyChord(['Escape']));
        act(() => {
            fireKeyDown('Escape');
        });
        expect(result.current).toBe(true);
        act(() => {
            fireKeyUp('Escape');
        });
        expect(result.current).toBe(false);
    });

    it('removes event listeners on unmount', () => {
        const addSpy = vi.spyOn(window, 'addEventListener');
        const removeSpy = vi.spyOn(window, 'removeEventListener');

        const { unmount } = renderHook(() => useKeyChord(['Control', 'k']));
        expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
        expect(addSpy).toHaveBeenCalledWith('keyup', expect.any(Function));

        unmount();

        expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
        expect(removeSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
    });

    it('returns false after all chord keys are released independently', () => {
        const { result } = renderHook(() => useKeyChord(['a', 'b', 'c']));
        act(() => {
            fireKeyDown('a');
            fireKeyDown('b');
            fireKeyDown('c');
        });
        expect(result.current).toBe(true);
        act(() => {
            fireKeyUp('a');
            fireKeyUp('b');
            fireKeyUp('c');
        });
        expect(result.current).toBe(false);
    });
});
