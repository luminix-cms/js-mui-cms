import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import RecursiveList from '../../components/RecursiveList';
import LayoutContext from '../../contexts/LayoutContext';
import { MenuItem } from '../../types/Menu';

const MockRecursiveMenu = vi.fn(() => null);

vi.mock('@luminix/core', () => ({
    app: vi.fn(() => ({
        getComponent: vi.fn(() => MockRecursiveMenu),
    })),
}));

const layoutValue = {
    open: false, setOpen: vi.fn(), layout: { drawer: { width: 280 } },
    isBreakpointUp: false, currentPage: '',
    setCurrentPage: vi.fn(), showSearch: false,
    setShowSearch: vi.fn(), showBackButton: false,
    setShowBackButton: vi.fn(),
};

const simpleItems: MenuItem[] = [
    { key: 'dashboard', text: 'Dashboard', icon: null },
    { key: 'users', text: 'Users', icon: null },
];

const nestedItems: MenuItem[] = [
    {
        key: 'settings',
        text: 'Settings',
        icon: null,
        children: [
            { key: 'profile', text: 'Profile', icon: null },
            { key: 'security', text: 'Security', icon: null },
        ],
    },
];

function renderList(items: MenuItem[], collapsed = false) {
    return render(
        <MemoryRouter>
            <LayoutContext.Provider value={layoutValue}>
                <RecursiveList items={items} collapsed={collapsed} />
            </LayoutContext.Provider>
        </MemoryRouter>
    );
}

describe('RecursiveList', () => {
    it('renders all top-level menu items', () => {
        renderList(simpleItems);
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Users')).toBeInTheDocument();
    });

    it('renders items with children and shows an expand icon', () => {
        renderList(nestedItems);
        expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('children are hidden initially in expanded mode', () => {
        renderList(nestedItems);
        expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    });

    it('clicking an item with children expands to show sub-items', async () => {
        renderList(nestedItems);
        await act(async () => {
            screen.getByText('Settings').click();
        });
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Security')).toBeInTheDocument();
    });

    it('in collapsed mode, opens RecursiveMenu (popover) instead of Collapse', async () => {
        MockRecursiveMenu.mockClear();
        renderList(nestedItems, true);
        const button = screen.getByText('Settings').closest('[role="button"]') as HTMLElement;
        expect(button).not.toBeNull();
        await act(async () => {
            button.click();
        });
        expect(MockRecursiveMenu).toHaveBeenCalled();
        const lastCall = MockRecursiveMenu.mock.calls.at(-1)![0];
        expect(lastCall.items).toEqual(nestedItems[0].children);
    });

    it('renders custom elements when the item has an element property', () => {
        const customElement = React.createElement('div', { 'data-testid': 'custom-el' }, 'Custom');
        const itemsWithElement: MenuItem[] = [
            { key: 'custom', text: '', icon: null, element: customElement },
        ];
        renderList(itemsWithElement);
        expect(screen.getByTestId('custom-el')).toBeInTheDocument();
    });
});
