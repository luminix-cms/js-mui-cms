import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import NotificationContext from '../../contexts/NotificationContext';
import LayoutContext from '../../contexts/LayoutContext';
import useDisplaceNotifications from '../../hooks/useDisplaceNotifications';

function makeWrapper(setDisplacement: ReturnType<typeof vi.fn>, isBreakpointUp = false) {
    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(
            LayoutContext.Provider,
            {
                value: {
                    open: false, setOpen: vi.fn(), layout: {},
                    isBreakpointUp,
                    currentPage: '', setCurrentPage: vi.fn(),
                    showSearch: false, setShowSearch: vi.fn(),
                    showBackButton: false, setShowBackButton: vi.fn(),
                },
            },
            React.createElement(
                NotificationContext.Provider,
                {
                    value: {
                        isOpen: false, notify: vi.fn(), dismissNotification: vi.fn(),
                        notifications: [], current: undefined,
                        displacement: '8px', setDisplacement,
                    },
                },
                children
            )
        );
}

describe('useDisplaceNotifications', () => {
    it('calls setDisplacement with the computed spacing value on mount', () => {
        const setDisplacement = vi.fn();
        renderHook(() => useDisplaceNotifications(5), { wrapper: makeWrapper(setDisplacement) });
        expect(setDisplacement).toHaveBeenCalledTimes(1);
        expect(setDisplacement.mock.calls[0][0]).toMatch(/px$/);
    });

    it('calls setDisplacement with default spacing on unmount (mobile)', () => {
        const setDisplacement = vi.fn();
        const { unmount } = renderHook(() => useDisplaceNotifications(5), {
            wrapper: makeWrapper(setDisplacement, false),
        });
        const mountCall = setDisplacement.mock.calls[0][0];
        unmount();
        const unmountCall = setDisplacement.mock.calls.at(-1)![0];
        expect(unmountCall).not.toBe(mountCall);
    });

    it('when value is false, uses the default displacement (same as unmount)', () => {
        const setDisplacement = vi.fn();
        renderHook(() => useDisplaceNotifications(false), {
            wrapper: makeWrapper(setDisplacement, false),
        });
        expect(setDisplacement).toHaveBeenCalledTimes(1);
        const desiredCall = setDisplacement.mock.calls[0][0];
        setDisplacement.mockClear();

        renderHook(() => useDisplaceNotifications(false), {
            wrapper: makeWrapper(setDisplacement, false),
        });
        const defaultCall = setDisplacement.mock.calls[0][0];
        expect(desiredCall).toBe(defaultCall);
    });

    it('uses desktop spacing (3) as default when isBreakpointUp is true', () => {
        const mobileDisplacement = vi.fn();
        renderHook(() => useDisplaceNotifications(false), {
            wrapper: makeWrapper(mobileDisplacement, false),
        });
        const mobileSpacing = mobileDisplacement.mock.calls[0][0];

        const desktopDisplacement = vi.fn();
        renderHook(() => useDisplaceNotifications(false), {
            wrapper: makeWrapper(desktopDisplacement, true),
        });
        const desktopSpacing = desktopDisplacement.mock.calls[0][0];

        expect(mobileSpacing).not.toBe(desktopSpacing);
    });
});
