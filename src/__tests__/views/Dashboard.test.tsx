import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../../views/Dashboard';
import LayoutContext from '../../contexts/LayoutContext';

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

const makeLayoutValue = (overrides = {}) => ({
    open: false, setOpen: vi.fn(), layout: {},
    isBreakpointUp: false, currentPage: '',
    setCurrentPage: vi.fn(), showSearch: false,
    setShowSearch: vi.fn(), showBackButton: false,
    setShowBackButton: vi.fn(),
    ...overrides,
});

function renderDashboard(overrides = {}) {
    return render(
        <MemoryRouter>
            <LayoutContext.Provider value={makeLayoutValue(overrides)}>
                <Dashboard />
            </LayoutContext.Provider>
        </MemoryRouter>
    );
}

describe('Dashboard', () => {
    it('renders the Dashboard text', () => {
        renderDashboard();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('sets the page title to Dashboard on mount', () => {
        const setCurrentPage = vi.fn();
        renderDashboard({ setCurrentPage });
        expect(setCurrentPage).toHaveBeenCalledWith('Dashboard');
    });

    it('clears the page title on unmount', () => {
        const setCurrentPage = vi.fn();
        const { unmount } = renderDashboard({ setCurrentPage });
        setCurrentPage.mockClear();
        unmount();
        expect(setCurrentPage).toHaveBeenCalledWith('');
    });
});
