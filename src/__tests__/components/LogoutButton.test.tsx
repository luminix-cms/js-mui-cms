import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import LayoutContext from '../../contexts/LayoutContext';
import LogoutButton from '../../components/Layout/Drawer/LogoutButton';

const mockLogout = vi.fn();
const mockGetLogoutCallback = vi.fn(() => mockLogout);

vi.mock('@luminix/core', () => ({
    app: vi.fn(() => ({
        getLogoutCallback: mockGetLogoutCallback,
    })),
}));

const layoutValue = {
    open: false,
    setOpen: vi.fn(),
    layout: {},
    isBreakpointUp: false,
    currentPage: '',
    setCurrentPage: vi.fn(),
    showSearch: false,
    setShowSearch: vi.fn(),
    showBackButton: false,
    setShowBackButton: vi.fn(),
};

function renderLogoutButton(props: { collapsed?: boolean } = {}) {
    return render(
        <LayoutContext.Provider value={layoutValue as any}>
            <LogoutButton {...props} />
        </LayoutContext.Provider>
    );
}

describe('LogoutButton', () => {
    beforeEach(() => {
        mockLogout.mockClear();
        mockGetLogoutCallback.mockClear();
        mockGetLogoutCallback.mockReturnValue(mockLogout);
    });

    it('renders a "Logout" label when not collapsed', () => {
        renderLogoutButton({ collapsed: false });
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('does not render the "Logout" label when collapsed', () => {
        renderLogoutButton({ collapsed: true });
        expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });

    it('renders a logout icon (svg)', () => {
        const { container } = renderLogoutButton();
        expect(container.querySelector('svg')).toBeTruthy();
    });

    it('calls the callback returned by app("cms").getLogoutCallback() when clicked', async () => {
        renderLogoutButton({ collapsed: false });
        await act(async () => {
            screen.getByRole('button').click();
        });
        expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('calls a custom logout callback registered via logoutUsing', async () => {
        const customLogout = vi.fn();
        mockGetLogoutCallback.mockReturnValue(customLogout);
        renderLogoutButton({ collapsed: false });
        await act(async () => {
            screen.getByRole('button').click();
        });
        expect(customLogout).toHaveBeenCalledTimes(1);
        expect(mockLogout).not.toHaveBeenCalled();
    });

    it('renders a button element when collapsed', () => {
        renderLogoutButton({ collapsed: true });
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders a Divider above the button', () => {
        const { container } = renderLogoutButton();
        expect(container.querySelector('hr')).toBeTruthy();
    });
});
