import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import LayoutContext from '../../contexts/LayoutContext';
import useBackButton from '../../hooks/useBackButton';

function makeWrapper(setShowBackButton: ReturnType<typeof vi.fn>) {
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
                setShowSearch: vi.fn(),
                showBackButton: false,
                setShowBackButton,
            },
        }, children);
}

describe('useBackButton', () => {
    it('calls setShowBackButton(true) on mount', () => {
        const setShowBackButton = vi.fn();
        renderHook(() => useBackButton(), { wrapper: makeWrapper(setShowBackButton) });
        expect(setShowBackButton).toHaveBeenCalledWith(true);
    });

    it('calls setShowBackButton(false) on unmount', () => {
        const setShowBackButton = vi.fn();
        const { unmount } = renderHook(() => useBackButton(), { wrapper: makeWrapper(setShowBackButton) });
        unmount();
        expect(setShowBackButton).toHaveBeenLastCalledWith(false);
    });
});
