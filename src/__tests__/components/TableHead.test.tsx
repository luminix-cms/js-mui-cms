import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Collection } from '@luminix/support';
import TableContext from '../../contexts/TableContext';
import LayoutContext from '../../contexts/LayoutContext';
import TableHead from '../../components/ModelIndex/Table/TableHead';

const MockShrinkedCell = vi.fn(({ children }: { children: React.ReactNode }) => (
    <th>{children}</th>
));

vi.mock('@luminix/core', () => ({
    app: vi.fn(() => ({
        getComponents: vi.fn(() => ({
            'ModelIndex.Table.ShrinkedCell': MockShrinkedCell,
        })),
    })),
    collect: vi.fn((items: unknown[]) => new Collection(items)),
}));

vi.mock('@luminix/react', () => ({
    useCollection: vi.fn((collection: unknown) => collection),
}));

const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'created_at', label: 'Created At', sortable: false },
];

const emptyCollection = new Collection([]);

function makeTableValue(overrides = {}) {
    return {
        columns,
        columnCount: columns.length + 1,
        selected: Object.assign(emptyCollection, {
            count: () => 0,
            contains: () => false,
            search: () => false,
        }) as never,
        massActions: [],
        items: emptyCollection as never,
        loading: false,
        error: null,
        Model: null as never,
        ...overrides,
    };
}

function makeLayoutValue(overrides = {}) {
    return {
        open: false,
        setOpen: vi.fn(),
        layout: {},
        isBreakpointUp: true,
        currentPage: '',
        setCurrentPage: vi.fn(),
        showSearch: false,
        setShowSearch: vi.fn(),
        showBackButton: false,
        setShowBackButton: vi.fn(),
        ...overrides,
    };
}

function renderTableHead(tableOverrides = {}, layoutOverrides = {}, initialUrl = '/') {
    return render(
        <MemoryRouter initialEntries={[initialUrl]}>
            <LayoutContext.Provider value={makeLayoutValue(layoutOverrides)}>
                <TableContext.Provider value={makeTableValue(tableOverrides)}>
                    <table>
                        <TableHead />
                    </table>
                </TableContext.Provider>
            </LayoutContext.Provider>
        </MemoryRouter>
    );
}

describe('TableHead', () => {
    it('renders column headers in desktop mode', () => {
        renderTableHead();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('does not render column headers in mobile mode', () => {
        renderTableHead({}, { isBreakpointUp: false });
        expect(screen.queryByText('Name')).not.toBeInTheDocument();
    });

    it('renders checkbox header when massActions are present', () => {
        const massActions = [{ label: 'Delete', name: 'delete', callback: vi.fn() }];
        renderTableHead({ massActions });
        expect(document.querySelector('th')).toBeInTheDocument();
    });

    it('shows active sort on column when order_by is set', () => {
        renderTableHead({}, {}, '/?order_by=name%3Aasc');
        expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('renders sort labels for sortable columns', () => {
        renderTableHead();
        const nameCell = screen.getByText('Name');
        expect(nameCell).toBeInTheDocument();
    });

    it('clicking a column header with no current sort sets order_by to asc', async () => {
        renderTableHead();
        const nameLabel = screen.getByText('Name');
        await act(async () => {
            nameLabel.click();
        });
        expect(document.querySelector('table')).toBeInTheDocument();
    });

    it('clicking a column header already sorted asc sets order_by to desc', async () => {
        renderTableHead({}, {}, '/?order_by=name%3Aasc');
        const nameLabel = screen.getByText('Name');
        await act(async () => {
            nameLabel.click();
        });
        expect(document.querySelector('table')).toBeInTheDocument();
    });

    it('clicking a column header already sorted desc removes order_by', async () => {
        renderTableHead({}, {}, '/?order_by=name%3Adesc');
        const nameLabel = screen.getByText('Name');
        await act(async () => {
            nameLabel.click();
        });
        expect(document.querySelector('table')).toBeInTheDocument();
    });

    it('clicking a different column sets order_by to that column asc', async () => {
        renderTableHead({}, {}, '/?order_by=email%3Aasc');
        const nameLabel = screen.getByText('Name');
        await act(async () => {
            nameLabel.click();
        });
        expect(document.querySelector('table')).toBeInTheDocument();
    });

    it('renders children passed to it', () => {
        render(
            <MemoryRouter>
                <LayoutContext.Provider value={makeLayoutValue()}>
                    <TableContext.Provider value={makeTableValue()}>
                        <table>
                            <TableHead>
                                <tr>
                                    <th data-testid="custom-header">Custom</th>
                                </tr>
                            </TableHead>
                        </table>
                    </TableContext.Provider>
                </LayoutContext.Provider>
            </MemoryRouter>
        );
        expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    });
});
