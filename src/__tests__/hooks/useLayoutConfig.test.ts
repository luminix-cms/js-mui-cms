import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import LayoutContext from '../../contexts/LayoutContext';
import useLayoutConfig from '../../hooks/useLayoutConfig';

function makeWrapper(layout: Record<string, unknown>) {
    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(LayoutContext.Provider, {
            value: {
                open: false, setOpen: vi.fn(), layout,
                isBreakpointUp: false, currentPage: '',
                setCurrentPage: vi.fn(), showSearch: false,
                setShowSearch: vi.fn(), showBackButton: false,
                setShowBackButton: vi.fn(),
            },
        }, children);
}

describe('useLayoutConfig', () => {
    it('returns the value at a simple path', () => {
        const { result } = renderHook(
            () => useLayoutConfig('drawer.width'),
            { wrapper: makeWrapper({ drawer: { width: 280 } }) }
        );
        expect(result.current).toBe(280);
    });

    it('returns undefined when the path does not exist and no default is provided', () => {
        const { result } = renderHook(
            () => useLayoutConfig('nonexistent.path'),
            { wrapper: makeWrapper({}) }
        );
        expect(result.current).toBeUndefined();
    });

    it('returns the defaultValue when the path does not exist', () => {
        const { result } = renderHook(
            () => useLayoutConfig('appBar.height', 64),
            { wrapper: makeWrapper({}) }
        );
        expect(result.current).toBe(64);
    });

    it('returns nested values via dot-notation', () => {
        const { result } = renderHook(
            () => useLayoutConfig('appBar.color'),
            { wrapper: makeWrapper({ appBar: { color: 'primary' } }) }
        );
        expect(result.current).toBe('primary');
    });

    it('returns the provided default over undefined when key exists but is undefined', () => {
        const { result } = renderHook(
            () => useLayoutConfig('breakpoint', 'md'),
            { wrapper: makeWrapper({ breakpoint: undefined }) }
        );
        expect(result.current).toBe('md');
    });
});
