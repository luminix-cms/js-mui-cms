import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import RecursiveMenu from '../../components/RecursiveMenu';
import LayoutContext from '../../contexts/LayoutContext';
import { MenuItem } from '../../types/Menu';

const layoutValue = {
    open: false,
    setOpen: vi.fn(),
    layout: { drawer: { width: 280 } },
    isBreakpointUp: false,
    currentPage: '',
    setCurrentPage: vi.fn(),
    showSearch: false,
    setShowSearch: vi.fn(),
    showBackButton: false,
    setShowBackButton: vi.fn(),
};

function renderMenu(items: MenuItem[], props: Partial<React.ComponentProps<typeof RecursiveMenu>> = {}) {
    const anchorEl = document.createElement('button');
    document.body.appendChild(anchorEl);

    return render(
        <MemoryRouter>
            <LayoutContext.Provider value={layoutValue}>
                <RecursiveMenu
                    open={true}
                    anchorEl={anchorEl}
                    onClose={vi.fn()}
                    items={items}
                    {...props}
                />
            </LayoutContext.Provider>
        </MemoryRouter>
    );
}

describe('RecursiveMenu', () => {
    it('renders menu items with text', () => {
        renderMenu([
            { key: 'home', text: 'Home', icon: null },
            { key: 'about', text: 'About', icon: null },
        ]);
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('renders a custom element when item has element prop', () => {
        const items: MenuItem[] = [
            {
                key: 'custom',
                text: '',
                icon: null,
                element: <div data-testid="custom-item">Custom</div>,
            },
        ];
        renderMenu(items);
        expect(screen.getByTestId('custom-item')).toBeInTheDocument();
    });

    it('renders icon when item has icon prop', () => {
        const items: MenuItem[] = [
            {
                key: 'icon-item',
                text: 'With Icon',
                icon: <svg data-testid="test-icon" />,
            },
        ];
        renderMenu(items);
        expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('renders ChevronRight for items with children (not collapsed)', () => {
        const items: MenuItem[] = [
            {
                key: 'parent',
                text: 'Parent',
                icon: null,
                children: [{ key: 'child', text: 'Child', icon: null }],
            },
        ];
        renderMenu(items, { collapsed: false });
        expect(screen.getByText('Parent')).toBeInTheDocument();
    });

    it('calls onClickItem when item with onClick is clicked', async () => {
        const onClickItem = vi.fn();
        const items: MenuItem[] = [
            { key: 'clickable', text: 'Clickable', icon: null, onClick: onClickItem },
        ];
        renderMenu(items);
        await act(async () => {
            screen.getByText('Clickable').click();
        });
        expect(onClickItem).toHaveBeenCalled();
    });

    it('calls parent onClick when item without children is clicked', async () => {
        const onClick = vi.fn();
        const items: MenuItem[] = [
            { key: 'item', text: 'Item', icon: null },
        ];
        renderMenu(items, { onClick });
        await act(async () => {
            screen.getByText('Item').click();
        });
        expect(onClick).toHaveBeenCalled();
    });

    it('clicking item with children toggles submenu open state', async () => {
        const items: MenuItem[] = [
            {
                key: 'parent',
                text: 'Parent',
                icon: null,
                children: [{ key: 'child', text: 'Child', icon: null }],
            },
        ];
        renderMenu(items);
        await act(async () => {
            screen.getByText('Parent').click();
        });
        expect(screen.getByText('Parent')).toBeInTheDocument();
    });

    it('renders in collapsed mode without chevron', () => {
        const items: MenuItem[] = [
            {
                key: 'parent',
                text: 'Parent',
                icon: null,
                children: [{ key: 'child', text: 'Child', icon: null }],
            },
        ];
        renderMenu(items, { collapsed: true });
        expect(screen.getByText('Parent')).toBeInTheDocument();
    });

    it('renders item with to prop as a link', () => {
        const items: MenuItem[] = [
            { key: 'link-item', text: 'Go Home', icon: null, to: '/' },
        ];
        renderMenu(items);
        expect(screen.getByText('Go Home')).toBeInTheDocument();
    });
});
