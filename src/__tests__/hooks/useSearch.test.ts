import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import LayoutContext from '../../contexts/LayoutContext';
import useSearch from '../../hooks/useSearch';

function makeWrapper(setShowSearch: ReturnType<typeof vi.fn>) {
    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(LayoutContext.Provider, {
            value: {
                open: false,
                setOpen: vi.fn(),
                layout: {},
                isBreakpointUp: false,
                currentPage: '',
                setCurrentPage: vi.fn(),
                showSearch: false,
                setShowSearch,
                showBackButton: false,
                setShowBackButton: vi.fn(),
            },
        }, children);
}

describe('useSearch', () => {
    it('calls setShowSearch(true) on mount', () => {
        const setShowSearch = vi.fn();
        renderHook(() => useSearch(), { wrapper: makeWrapper(setShowSearch) });
        expect(setShowSearch).toHaveBeenCalledWith(true);
    });

    it('calls setShowSearch(false) on unmount', () => {
        const setShowSearch = vi.fn();
        const { unmount } = renderHook(() => useSearch(), { wrapper: makeWrapper(setShowSearch) });
        unmount();
        expect(setShowSearch).toHaveBeenLastCalledWith(false);
    });
});
