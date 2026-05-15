import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import Layout from '../../views/Layout/Layout';
import LayoutContext from '../../contexts/LayoutContext';

const MockAppBar = vi.fn((_props: object) => <div data-testid="appbar" />);
const MockDrawer = vi.fn(() => <div data-testid="drawer" />);
const MockPageTitle = vi.fn(() => <div data-testid="page-title" />);

vi.mock('@luminix/core', () => ({
    app: vi.fn(() => ({
        getComponents: vi.fn(() => ({
            DesktopPageTitle: MockPageTitle,
            'Layout.AppBar': MockAppBar,
            'Layout.Drawer': MockDrawer,
        })),
    })),
}));

const layoutValue = {
    open: false, setOpen: vi.fn(), layout: { appBar: { height: 64 } },
    isBreakpointUp: false, currentPage: '',
    setCurrentPage: vi.fn(), showSearch: false,
    setShowSearch: vi.fn(), showBackButton: false,
    setShowBackButton: vi.fn(),
};

function renderLayout(children?: React.ReactNode) {
    return render(
        <LayoutContext.Provider value={layoutValue}>
            <Layout>{children}</Layout>
        </LayoutContext.Provider>
    );
}

describe('Layout', () => {
    it('renders children in the main area', () => {
        renderLayout(<span data-testid="child">hello</span>);
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('renders the AppBar slot', () => {
        renderLayout();
        expect(screen.getByTestId('appbar')).toBeInTheDocument();
    });

    it('renders the Drawer slot', () => {
        renderLayout();
        expect(screen.getByTestId('drawer')).toBeInTheDocument();
    });

    it('renders the DesktopPageTitle slot', () => {
        renderLayout();
        expect(screen.getByTestId('page-title')).toBeInTheDocument();
    });
});
