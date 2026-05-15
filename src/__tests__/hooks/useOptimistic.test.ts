import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useOptimistic from '../../hooks/useOptimistic';

describe('useOptimistic', () => {
    it('returns the initial state', () => {
        const { result } = renderHook(() => useOptimistic('initial'));
        expect(result.current).toBe('initial');
    });

    it('updates when the new state is truthy', () => {
        const { result, rerender } = renderHook(({ state }) => useOptimistic(state), {
            initialProps: { state: 'first' as string | null },
        });
        rerender({ state: 'second' });
        expect(result.current).toBe('second');
    });

    it('retains last truthy value when state becomes falsy', () => {
        const { result, rerender } = renderHook(({ state }) => useOptimistic(state), {
            initialProps: { state: 'value' as string | null },
        });
        rerender({ state: null });
        expect(result.current).toBe('value');
    });

    it('retains last truthy value when state becomes empty string', () => {
        const { result, rerender } = renderHook(({ state }) => useOptimistic(state), {
            initialProps: { state: 'value' as string },
        });
        rerender({ state: '' });
        expect(result.current).toBe('value');
    });

    it('updates again when state returns to a truthy value after being falsy', () => {
        const { result, rerender } = renderHook(({ state }) => useOptimistic(state), {
            initialProps: { state: 'first' as string | null },
        });
        rerender({ state: null });
        rerender({ state: 'second' });
        expect(result.current).toBe('second');
    });

    it('works with undefined as initial state', () => {
        const { result } = renderHook(() => useOptimistic(undefined));
        expect(result.current).toBeUndefined();
    });

    it('works with object values', () => {
        const obj1 = { id: 1 };
        const obj2 = { id: 2 };
        const { result, rerender } = renderHook(({ state }) => useOptimistic(state), {
            initialProps: { state: obj1 as typeof obj1 | null },
        });
        expect(result.current).toBe(obj1);
        rerender({ state: null });
        expect(result.current).toBe(obj1);
        rerender({ state: obj2 });
        expect(result.current).toBe(obj2);
    });

    it('state updates inside act reflect immediately', () => {
        const { result, rerender } = renderHook(({ state }) => useOptimistic(state), {
            initialProps: { state: 'a' as string | null },
        });
        act(() => {
            rerender({ state: 'b' });
        });
        expect(result.current).toBe('b');
    });
});
