import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Collection } from '@luminix/support';

import TableRow from '../../components/ModelIndex/Table/TableBody/TableRow';
import TableContext from '../../contexts/TableContext';
import ModelContext from '../../contexts/ModelContext';
import LayoutContext from '../../contexts/LayoutContext';
import NotificationContext from '../../contexts/NotificationContext';
import DialogContext from '../../contexts/DialogContext';

import type { RowClickHandler } from '../../types/Table';

const mockGetRowClickHandlers = vi.fn<(...args: unknown[]) => RowClickHandler[]>(() => []);
const mockNotify = vi.fn();
const mockDialog = vi.fn();
const mockRefresh = vi.fn();

const MockShrinkedCell = vi.fn(({ children }: { children?: React.ReactNode }) => (
    <td data-testid="shrinked-cell">{children}</td>
));
const MockInstanceActions = vi.fn(() => <button type="button" data-testid="instance-actions" />);

vi.mock('@luminix/core', () => ({
    collect: vi.fn((items: unknown[] = []) => new Collection(items)),
    config: vi.fn((_key: string, def: unknown) => def),
    ModelType: class {},
}));

vi.mock('@luminix/react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@luminix/react')>();
    return {
        ...actual,
        useCollection: (col: Collection<unknown>) => col,
        usePagination: vi.fn(() => ({ refresh: mockRefresh })),
    };
});

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../facades/Cms', () => {
    // The factory runs while TableRow is imported, so every reference to a module-level binding
    // has to stay lazy.
    const methods: Record<string, unknown> = {
        getRowClickHandlers: (...args: unknown[]) => mockGetRowClickHandlers(...args),
        getComponents: () => ({
            'ModelIndex.Table.ShrinkedCell': MockShrinkedCell,
            'ModelIndex.InstanceActions': MockInstanceActions,
        }),
    };

    return {
        // Any other property is a per-column content reducer — return the raw value untouched.
        default: new Proxy(methods, {
            get: (target, prop: string) => (prop in target ? target[prop] : (value: unknown) => value),
        }),
    };
});

const mockModel = {
    plural: () => 'Users',
    singular: () => 'User',
    getSchemaName: () => 'user',
    getSchema: () => ({ softDeletes: true }),
};

const makeItem = (overrides: Record<string, unknown> = {}) => ({
    name: 'Alice',
    email: 'alice@example.com',
    deletedAt: null,
    getType: () => 'user',
    getKey: () => 7,
    getLabel: () => 'Alice',
    ...overrides,
});

const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
];

type RenderOptions = {
    isDesktop?: boolean;
    massActions?: unknown[];
    item?: ReturnType<typeof makeItem>;
};

function renderTableRow({ isDesktop = true, massActions = [], item = makeItem() }: RenderOptions = {}) {
    return render(
        <MemoryRouter>
            <LayoutContext.Provider value={{
                open: false, setOpen: vi.fn(), layout: {},
                isBreakpointUp: isDesktop, currentPage: '',
                setCurrentPage: vi.fn(), showSearch: false,
                setShowSearch: vi.fn(), showBackButton: false,
                setShowBackButton: vi.fn(),
            } as never}>
                <NotificationContext.Provider value={{
                    isOpen: false, notify: mockNotify, dismissNotification: vi.fn(),
                    notifications: [], current: undefined,
                    displacement: '8px', setDisplacement: vi.fn(),
                }}>
                    <DialogContext.Provider value={{
                        isOpen: false, dialog: mockDialog, dismissDialog: vi.fn(), current: undefined,
                    }}>
                        <TableContext.Provider value={{
                            columns,
                            columnCount: columns.length,
                            selected: new Collection([]) as never,
                            items: new Collection([item]) as never,
                            massActions: massActions as never,
                            error: null,
                            Model: mockModel as never,
                        }}>
                            <ModelContext.Provider value={{ Model: mockModel as never }}>
                                <table>
                                    <tbody>
                                        <TableRow item={item as never} />
                                    </tbody>
                                </table>
                            </ModelContext.Provider>
                        </TableContext.Provider>
                    </DialogContext.Provider>
                </NotificationContext.Provider>
            </LayoutContext.Provider>
        </MemoryRouter>
    );
}

beforeEach(() => {
    mockGetRowClickHandlers.mockReset();
    mockGetRowClickHandlers.mockReturnValue([]);
    mockNotify.mockClear();
    mockDialog.mockClear();
});

describe('TableRow — row click handlers', () => {
    it('resolves the handler chain for the current model and item', () => {
        const item = makeItem();
        renderTableRow({ item });
        expect(mockGetRowClickHandlers).toHaveBeenCalledWith(mockModel, item);
    });

    it('invokes the handler with the action event, the item and the mouse event', async () => {
        const user = userEvent.setup();
        const handler = vi.fn();
        mockGetRowClickHandlers.mockReturnValue([handler]);

        const item = makeItem();
        renderTableRow({ item });

        await user.click(screen.getByText('Alice'));

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith(expect.objectContaining({
            item,
            navigate: expect.any(Function),
            notify: mockNotify,
            dialog: mockDialog,
            refresh: mockRefresh,
            t: expect.any(Function),
            mouseEvent: expect.objectContaining({ type: 'click' }),
        }));
    });

    it('runs every handler of the chain, in order', async () => {
        const user = userEvent.setup();
        const calls: string[] = [];
        mockGetRowClickHandlers.mockReturnValue([
            () => { calls.push('first'); },
            () => { calls.push('second'); },
        ]);

        renderTableRow();

        await user.click(screen.getByText('Alice'));

        expect(calls).toEqual(['first', 'second']);
    });

    it('fires the chain from any data cell', async () => {
        const user = userEvent.setup();
        const handler = vi.fn();
        mockGetRowClickHandlers.mockReturnValue([handler]);

        renderTableRow();

        await user.click(screen.getByText('alice@example.com'));

        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('marks the row as clickable when the chain is not empty', () => {
        mockGetRowClickHandlers.mockReturnValue([vi.fn()]);
        const { container } = renderTableRow();
        expect(container.querySelector('tr')).toHaveClass('MuiTableRow-hover');
    });

    it('does not mark the row as clickable when the chain is empty', () => {
        mockGetRowClickHandlers.mockReturnValue([]);
        const { container } = renderTableRow();
        expect(container.querySelector('tr')).not.toHaveClass('MuiTableRow-hover');
    });

    it('does nothing on click when the chain is empty', async () => {
        const user = userEvent.setup();
        mockGetRowClickHandlers.mockReturnValue([]);

        renderTableRow();

        await user.click(screen.getByText('Alice'));

        // Nothing to assert other than the absence of a crash — the cell has no onClick at all.
        expect(mockGetRowClickHandlers).toHaveBeenCalled();
    });

    it('fires the chain from the collapsed cell on mobile', async () => {
        const user = userEvent.setup();
        const handler = vi.fn();
        mockGetRowClickHandlers.mockReturnValue([handler]);

        renderTableRow({ isDesktop: false });

        await user.click(screen.getByText('Alice'));

        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('does not fire the chain from the selection checkbox', async () => {
        const user = userEvent.setup();
        const handler = vi.fn();
        mockGetRowClickHandlers.mockReturnValue([handler]);

        renderTableRow({ massActions: [{ key: 'delete', label: 'Delete', callback: vi.fn() }] });

        await user.click(screen.getByRole('checkbox'));

        expect(handler).not.toHaveBeenCalled();
    });

    it('does not fire the chain from the instance actions cell', async () => {
        const user = userEvent.setup();
        const handler = vi.fn();
        mockGetRowClickHandlers.mockReturnValue([handler]);

        renderTableRow();

        await user.click(screen.getByTestId('instance-actions'));

        expect(handler).not.toHaveBeenCalled();
    });
});
