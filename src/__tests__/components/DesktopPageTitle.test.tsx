import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import LayoutContext from '../../contexts/LayoutContext';
import DesktopPageTitle from '../../components/DesktopPageTitle';

const MockBackButton = vi.fn(() => <button data-testid="back-button" />);

vi.mock('@luminix/core', () => ({
    app: vi.fn(() => ({
        getComponents: vi.fn(() => ({
            'Layout.BackButton': MockBackButton,
        })),
    })),
}));

function makeLayoutValue(overrides = {}) {
    return {
        open: false,
        setOpen: vi.fn(),
        layout: { breakpoint: 'md' },
        isBreakpointUp: false,
        currentPage: '',
        setCurrentPage: vi.fn(),
        showSearch: false,
        setShowSearch: vi.fn(),
        showBackButton: false,
        setShowBackButton: vi.fn(),
        ...overrides,
    };
}

function renderPageTitle(overrides = {}) {
    return render(
        <LayoutContext.Provider value={makeLayoutValue(overrides)}>
            <DesktopPageTitle />
        </LayoutContext.Provider>
    );
}

describe('DesktopPageTitle', () => {
    it('renders without errors', () => {
        const { container } = renderPageTitle();
        expect(container).toBeInTheDocument();
    });

    it('renders the current page title', () => {
        renderPageTitle({ currentPage: 'Users' });
        expect(screen.getByText('Users')).toBeInTheDocument();
    });

    it('does not render BackButton when showBackButton is false', () => {
        renderPageTitle({ showBackButton: false });
        expect(screen.queryByTestId('back-button')).not.toBeInTheDocument();
    });

    it('renders BackButton when showBackButton is true', () => {
        renderPageTitle({ showBackButton: true });
        expect(screen.getByTestId('back-button')).toBeInTheDocument();
    });

    it('renders empty title when no currentPage', () => {
        renderPageTitle({ currentPage: '' });
        const { container } = renderPageTitle();
        expect(container).toBeInTheDocument();
    });
});
