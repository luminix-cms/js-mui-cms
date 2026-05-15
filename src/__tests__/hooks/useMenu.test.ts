import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import LayoutContext from '../../contexts/LayoutContext';
import useMenu from '../../hooks/useMenu';

function makeWrapper(open: boolean, setOpen: ReturnType<typeof vi.fn>) {
    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(LayoutContext.Provider, {
            value: {
                open,
                setOpen,
                layout: {},
                isBreakpointUp: false,
                currentPage: '',
                setCurrentPage: vi.fn(),
                showSearch: false,
                setShowSearch: vi.fn(),
                showBackButton: false,
                setShowBackButton: vi.fn(),
            },
        }, children);
}

describe('useMenu', () => {
    it('returns the current open state from context', () => {
        const { result } = renderHook(() => useMenu(), { wrapper: makeWrapper(true, vi.fn()) });
        expect(result.current.open).toBe(true);
    });

    it('handleDrawerOpen calls setOpen(true)', () => {
        const setOpen = vi.fn();
        const { result } = renderHook(() => useMenu(), { wrapper: makeWrapper(false, setOpen) });
        act(() => {
            result.current.handleDrawerOpen();
        });
        expect(setOpen).toHaveBeenCalledWith(true);
    });

    it('handleDrawerClose calls setOpen(false)', () => {
        const setOpen = vi.fn();
        const { result } = renderHook(() => useMenu(), { wrapper: makeWrapper(true, setOpen) });
        act(() => {
            result.current.handleDrawerClose();
        });
        expect(setOpen).toHaveBeenCalledWith(false);
    });

    it('toggle calls setOpen with a function that inverts the previous value', () => {
        const setOpen = vi.fn();
        const { result } = renderHook(() => useMenu(), { wrapper: makeWrapper(false, setOpen) });
        act(() => {
            result.current.toggle();
        });
        const toggleFn = setOpen.mock.calls[0][0] as (prev: boolean) => boolean;
        expect(toggleFn(false)).toBe(true);
        expect(toggleFn(true)).toBe(false);
    });
});
