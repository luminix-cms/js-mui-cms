import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ModelIndex from '../../views/ModelIndex';
import LayoutContext from '../../contexts/LayoutContext';
import ModelContext from '../../contexts/ModelContext';

const MockBreadcrumbs = vi.fn((p: { parts: { name: string }[] }) => (
    <div data-testid="breadcrumbs">{p.parts[0]?.name}</div>
));
const MockPagination = vi.fn((p: { variant?: string }) => (
    <div data-testid={`pagination-${p.variant ?? 'default'}`} />
));
const MockStaticActions = vi.fn(() => <div data-testid="static-actions" />);
const MockTable = vi.fn(({ children }: { children?: React.ReactNode }) => (
    <div data-testid="table">{children}</div>
));
const MockTableHead = vi.fn(({ children }: { children?: React.ReactNode }) => <div>{children}</div>);
const MockTableBody = vi.fn(() => <div data-testid="table-body" />);
const MockTableFooter = vi.fn(() => <div data-testid="table-footer" />);
const MockTableToolbar = vi.fn(() => <div data-testid="table-toolbar" />);
const MockTableRow = vi.fn(() => null);
const MockTabs = vi.fn(() => <div data-testid="tabs" />);

vi.mock('@luminix/core', () => ({
    app: vi.fn(() => ({
        getComponents: vi.fn(() => ({
            Breadcrumbs: MockBreadcrumbs,
            'ModelIndex.Pagination': MockPagination,
            'ModelIndex.StaticActions': MockStaticActions,
            'ModelIndex.Table': MockTable,
            'ModelIndex.Table.TableHead': MockTableHead,
            'ModelIndex.Table.TableBody': MockTableBody,
            'ModelIndex.Table.TableFooter': MockTableFooter,
            'ModelIndex.Table.TableToolbar': MockTableToolbar,
            'ModelIndex.Table.TableBody.TableRow': MockTableRow,
            'ModelIndex.Tabs': MockTabs,
        })),
    })),
    ModelType: class {},
}));

vi.mock('@luminix/react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@luminix/react')>();
    return {
        ...actual,
        usePagination: vi.fn(() => ({ data: [], error: null, loading: false })),
    };
});

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

const mockModel = {
    plural: vi.fn(() => 'Users'),
    singular: vi.fn(() => 'User'),
    getSchemaName: vi.fn(() => 'user'),
    getSchema: vi.fn(() => ({ softDeletes: false })),
};

const makeLayoutValue = (isDesktop = false) => ({
    open: false, setOpen: vi.fn(), layout: {},
    isBreakpointUp: isDesktop, currentPage: '',
    setCurrentPage: vi.fn(), showSearch: false,
    setShowSearch: vi.fn(), showBackButton: false,
    setShowBackButton: vi.fn(),
});

function renderModelIndex(isDesktop = false) {
    return render(
        <MemoryRouter>
            <LayoutContext.Provider value={makeLayoutValue(isDesktop)}>
                <ModelContext.Provider value={{ Model: mockModel as never }}>
                    <ModelIndex />
                </ModelContext.Provider>
            </LayoutContext.Provider>
        </MemoryRouter>
    );
}

describe('ModelIndex', () => {
    it('renders the table', () => {
        renderModelIndex();
        expect(screen.getByTestId('table')).toBeInTheDocument();
    });

    it('renders breadcrumbs with the model plural name', () => {
        renderModelIndex();
        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('Users');
    });

    it('shows compact pagination on mobile', () => {
        renderModelIndex(false);
        expect(screen.getByTestId('pagination-compact')).toBeInTheDocument();
    });

    it('does not show compact pagination on desktop', () => {
        renderModelIndex(true);
        expect(screen.queryByTestId('pagination-compact')).not.toBeInTheDocument();
    });

    it('renders the tabs slot', () => {
        renderModelIndex();
        expect(screen.getByTestId('tabs')).toBeInTheDocument();
    });
});
