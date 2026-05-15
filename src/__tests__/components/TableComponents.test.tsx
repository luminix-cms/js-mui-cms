import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Collection } from '@luminix/support';
import TableContext from '../../contexts/TableContext';
import LayoutContext from '../../contexts/LayoutContext';
import TableToolbar from '../../components/ModelIndex/Table/TableToolbar';
import TableFooter from '../../components/ModelIndex/Table/TableFooter';

const MockFilter = vi.fn(() => <div data-testid="filter" />);
const MockMassActions = vi.fn(() => <div data-testid="mass-actions" />);
const MockSort = vi.fn(() => <div data-testid="sort" />);
const MockPagination = vi.fn(() => <div data-testid="pagination" />);
const MockPaginationDetails = vi.fn(() => <div data-testid="pagination-details" />);
const MockPerPageSwitch = vi.fn(() => <div data-testid="per-page-switch" />);

vi.mock('@luminix/core', () => ({
    app: vi.fn(() => ({
        getComponents: vi.fn(() => ({
            'ModelIndex.Filter': MockFilter,
            'ModelIndex.MassActions': MockMassActions,
            'ModelIndex.Sort': MockSort,
            'ModelIndex.Pagination': MockPagination,
            'ModelIndex.PaginationDetails': MockPaginationDetails,
            'ModelIndex.PerPageSwitch': MockPerPageSwitch,
        })),
    })),
    collect: vi.fn((items: unknown[]) => new Collection(items)),
}));

const mockModel = { plural: () => 'Users', singular: () => 'User' };

function makeTableValue(overrides = {}) {
    return {
        columns: [{ key: 'name', label: 'Name', sortable: true }],
        columnCount: 2,
        selected: { count: () => 0 } as never,
        massActions: [],
        items: undefined,
        loading: false,
        error: null,
        Model: mockModel as never,
        ...overrides,
    };
}

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

function renderToolbar(component: React.ReactElement, tableOverrides = {}, layoutOverrides = {}) {
    return render(
        <MemoryRouter>
            <LayoutContext.Provider value={makeLayoutValue(layoutOverrides)}>
                <TableContext.Provider value={makeTableValue(tableOverrides)}>
                    <table>
                        <tbody>
                            {component}
                        </tbody>
                    </table>
                </TableContext.Provider>
            </LayoutContext.Provider>
        </MemoryRouter>
    );
}

function renderFooter(component: React.ReactElement, tableOverrides = {}, layoutOverrides = {}) {
    return render(
        <MemoryRouter>
            <LayoutContext.Provider value={makeLayoutValue(layoutOverrides)}>
                <TableContext.Provider value={makeTableValue(tableOverrides)}>
                    <table>
                        {component}
                    </table>
                </TableContext.Provider>
            </LayoutContext.Provider>
        </MemoryRouter>
    );
}

describe('TableToolbar', () => {
    it('renders the Filter component', () => {
        renderToolbar(<TableToolbar />);
        expect(screen.getByTestId('filter')).toBeInTheDocument();
    });

    it('renders MassActions component', () => {
        renderToolbar(<TableToolbar />);
        expect(screen.getByTestId('mass-actions')).toBeInTheDocument();
    });

    it('renders Sort in mobile mode (not desktop)', () => {
        renderToolbar(<TableToolbar />, {}, { isBreakpointUp: false });
        expect(screen.getByTestId('sort')).toBeInTheDocument();
    });

    it('does not render Sort in desktop mode', () => {
        renderToolbar(<TableToolbar />, {}, { isBreakpointUp: true });
        expect(screen.queryByTestId('sort')).not.toBeInTheDocument();
    });

    it('renders compact Pagination in desktop mode', () => {
        renderToolbar(<TableToolbar />, {}, { isBreakpointUp: true });
        expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });
});

describe('TableFooter', () => {
    it('renders Pagination component', () => {
        renderFooter(<TableFooter />);
        expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('renders PaginationDetails component', () => {
        renderFooter(<TableFooter />);
        expect(screen.getByTestId('pagination-details')).toBeInTheDocument();
    });

    it('renders PerPageSwitch component', () => {
        renderFooter(<TableFooter />);
        expect(screen.getByTestId('per-page-switch')).toBeInTheDocument();
    });

    it('renders children when provided', () => {
        renderFooter(
            <TableFooter>
                <tr>
                    <td data-testid="custom-child">Custom</td>
                </tr>
            </TableFooter>
        );
        expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    });

    it('renders in desktop mode with horizontal layout', () => {
        renderFooter(<TableFooter />, {}, { isBreakpointUp: true });
        expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });
});
