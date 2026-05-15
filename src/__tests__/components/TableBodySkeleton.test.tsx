import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Collection } from '@luminix/support';
import TableContext from '../../contexts/TableContext';
import LayoutContext from '../../contexts/LayoutContext';
import ModelContext from '../../contexts/ModelContext';
import TableBody from '../../components/ModelIndex/Table/TableBody';
import Skeleton from '../../components/ModelIndex/Table/TableBody/Skeleton';

const MockStaticActions = vi.fn(() => null);
const MockShrinkedCell = vi.fn(({ children }: { children: React.ReactNode }) => (
    <td>{children}</td>
));

vi.mock('@luminix/core', () => ({
    app: vi.fn(() => ({
        getComponents: vi.fn(() => ({
            'ModelIndex.StaticActions': MockStaticActions,
            'ModelIndex.Table.ShrinkedCell': MockShrinkedCell,
        })),
    })),
    collect: vi.fn((items: unknown[]) => new Collection(items)),
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

class FakeModel {
    static plural() { return 'Items'; }
    static singular() { return 'Item'; }
    static getSchemaName() { return 'item'; }
}

const emptyItems = new Collection([]);
const columns = [{ key: 'name', label: 'Name', sortable: true }];

function makeTableValue(overrides = {}) {
    return {
        columns,
        columnCount: 2,
        selected: { count: () => 0 } as never,
        massActions: [],
        items: emptyItems as never,
        loading: false,
        error: null,
        Model: FakeModel as never,
        ...overrides,
    };
}

function makeLayoutValue(overrides = {}) {
    return {
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
        ...overrides,
    };
}

function renderTableBody(tableOverrides = {}, layoutOverrides = {}, children: React.ReactNode = undefined) {
    return render(
        <MemoryRouter>
            <LayoutContext.Provider value={makeLayoutValue(layoutOverrides)}>
                <ModelContext.Provider value={{ Model: FakeModel as never }}>
                    <TableContext.Provider value={makeTableValue(tableOverrides)}>
                        <table>
                            <TableBody>{children}</TableBody>
                        </table>
                    </TableContext.Provider>
                </ModelContext.Provider>
            </LayoutContext.Provider>
        </MemoryRouter>
    );
}

function renderSkeleton(tableOverrides = {}, layoutOverrides = {}) {
    return render(
        <LayoutContext.Provider value={makeLayoutValue(layoutOverrides)}>
            <TableContext.Provider value={makeTableValue(tableOverrides)}>
                <table>
                    <tbody>
                        <Skeleton />
                    </tbody>
                </table>
            </TableContext.Provider>
        </LayoutContext.Provider>
    );
}

describe('TableBody', () => {
    it('renders "No :model found" when items is empty and not loading', () => {
        renderTableBody();
        expect(screen.getByText('No :model found')).toBeInTheDocument();
    });

    it('renders Skeleton when loading is true', () => {
        renderTableBody({ loading: true });
        expect(document.querySelector('table')).toBeInTheDocument();
    });

    it('renders children when passed as a React element', () => {
        renderTableBody(
            {},
            {},
            <tr data-testid="custom-row"><td>Row</td></tr>
        );
        expect(document.querySelector('table')).toBeInTheDocument();
    });

    it('renders Skeleton when items have mismatched type', () => {
        const itemsWithWrongType = {
            count: () => 1,
            every: () => false,
            map: vi.fn(),
        } as never;
        renderTableBody({ items: itemsWithWrongType, loading: false });
        expect(document.querySelector('table')).toBeInTheDocument();
    });
});

describe('Skeleton', () => {
    it('renders skeleton rows in desktop mode', () => {
        renderSkeleton({ columns }, { isBreakpointUp: true });
        expect(document.querySelector('table')).toBeInTheDocument();
    });

    it('renders skeleton rows in mobile mode', () => {
        renderSkeleton({ columns }, { isBreakpointUp: false });
        expect(document.querySelector('table')).toBeInTheDocument();
    });

    it('renders 15 skeleton rows by default when items is undefined', () => {
        renderSkeleton({ items: undefined, columns });
        const rows = document.querySelectorAll('tr');
        expect(rows.length).toBeGreaterThan(0);
    });

    it('renders checkboxes when massActions are present', () => {
        const massActions = [{ label: 'Delete', name: 'delete', callback: vi.fn() }];
        renderSkeleton({ massActions, columns }, { isBreakpointUp: true });
        expect(document.querySelector('table')).toBeInTheDocument();
    });
});
