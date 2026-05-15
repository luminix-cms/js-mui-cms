import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import LayoutContext from '../../contexts/LayoutContext';
import useSetPageTitle from '../../hooks/useSetPageTitle';

function makeWrapper(setCurrentPage: ReturnType<typeof vi.fn>) {
    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(LayoutContext.Provider, {
            value: {
                open: false,
                setOpen: vi.fn(),
                layout: {},
                isBreakpointUp: false,
                currentPage: '',
                setCurrentPage,
                showSearch: false,
                setShowSearch: vi.fn(),
                showBackButton: false,
                setShowBackButton: vi.fn(),
            },
        }, children);
}

describe('useSetPageTitle', () => {
    it('calls setCurrentPage with the title on mount', () => {
        const setCurrentPage = vi.fn();
        renderHook(() => useSetPageTitle('Dashboard'), { wrapper: makeWrapper(setCurrentPage) });
        expect(setCurrentPage).toHaveBeenCalledWith('Dashboard');
    });

    it('calls setCurrentPage with empty string on unmount', () => {
        const setCurrentPage = vi.fn();
        const { unmount } = renderHook(() => useSetPageTitle('Dashboard'), { wrapper: makeWrapper(setCurrentPage) });
        unmount();
        expect(setCurrentPage).toHaveBeenLastCalledWith('');
    });

    it('calls setCurrentPage again when the title argument changes', () => {
        const setCurrentPage = vi.fn();
        const { rerender } = renderHook(({ title }) => useSetPageTitle(title), {
            initialProps: { title: 'Page A' },
            wrapper: makeWrapper(setCurrentPage),
        });
        rerender({ title: 'Page B' });
        expect(setCurrentPage).toHaveBeenCalledWith('Page B');
    });
});
