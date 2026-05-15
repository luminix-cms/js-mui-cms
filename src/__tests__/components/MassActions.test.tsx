import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Collection } from '@luminix/support';
import MassActions from '../../components/ModelIndex/MassActions';
import TableContext from '../../contexts/TableContext';
import NotificationContext from '../../contexts/NotificationContext';
import DialogContext from '../../contexts/DialogContext';

vi.mock('@luminix/core', () => ({
    collect: vi.fn((items: unknown[]) => new Collection(items)),
    ModelType: class {},
}));

vi.mock('@luminix/react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@luminix/react')>();
    return {
        ...actual,
        useCollection: (col: Collection<unknown>) => col,
        usePagination: vi.fn(() => ({ refresh: vi.fn() })),
    };
});

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

const mockCallback = vi.fn();
const massActions = [
    { key: 'delete', label: 'Delete', callback: mockCallback },
    { key: 'export', label: 'Export', callback: mockCallback },
];

function makeWrapper(selectedItems: unknown[]) {
    const selectedCollection = new Collection(selectedItems);
    const itemsCollection = new Collection([{ id: 1 }, { id: 2 }, { id: 3 }]);

    return ({ children }: { children: React.ReactNode }) => (
        <MemoryRouter>
            <NotificationContext.Provider value={{
                isOpen: false, notify: vi.fn(), dismissNotification: vi.fn(),
                notifications: [], current: undefined,
                displacement: '8px', setDisplacement: vi.fn(),
            }}>
                <DialogContext.Provider value={{
                    isOpen: false, dialog: vi.fn(), dismissDialog: vi.fn(), current: undefined,
                }}>
                    <TableContext.Provider value={{
                        columns: [],
                        columnCount: 0,
                        selected: selectedCollection as never,
                        items: itemsCollection as never,
                        massActions,
                        error: new Error(),
                        Model: null as never,
                    }}>
                        {children}
                    </TableContext.Provider>
                </DialogContext.Provider>
            </NotificationContext.Provider>
        </MemoryRouter>
    );
}

describe('MassActions', () => {
    it('returns null when there are no mass actions', () => {
        const { container } = render(
            <MemoryRouter>
                <TableContext.Provider value={{
                    columns: [], columnCount: 0,
                    selected: new Collection([]) as never,
                    items: new Collection([]) as never,
                    massActions: [],
                    error: new Error(), Model: null as never,
                }}>
                    <MassActions />
                </TableContext.Provider>
            </MemoryRouter>
        );
        expect(container.firstChild).toBeNull();
    });

    it('shows the select as disabled when nothing is selected', () => {
        render(<MassActions />, { wrapper: makeWrapper([]) });
        expect(screen.getByRole('combobox')).toHaveAttribute('aria-disabled', 'true');
    });

    it('shows the Apply button as disabled when nothing is selected', () => {
        render(<MassActions />, { wrapper: makeWrapper([]) });
        expect(screen.getByRole('button', { name: /apply/i })).toBeDisabled();
    });

    it('shows "Select items to apply" label when selection is empty', () => {
        render(<MassActions />, { wrapper: makeWrapper([]) });
        expect(screen.getAllByText(/select items to apply/i)[0]).toBeInTheDocument();
    });

    it('shows "Select action" label when items are selected', () => {
        render(<MassActions />, { wrapper: makeWrapper([{ id: 1 }]) });
        expect(screen.getAllByText(/select action/i)[0]).toBeInTheDocument();
    });

    it('enables the select when items are selected', () => {
        render(<MassActions />, { wrapper: makeWrapper([{ id: 1 }]) });
        expect(screen.getByRole('combobox')).not.toBeDisabled();
    });

    it('Apply button fires the selected action callback', async () => {
        const user = userEvent.setup();
        mockCallback.mockClear();
        render(<MassActions />, { wrapper: makeWrapper([{ id: 1 }]) });

        await user.click(screen.getByRole('combobox'));
        const deleteOption = await screen.findByRole('option', { name: 'Delete' });
        await act(async () => {
            await user.click(deleteOption);
        });

        await act(async () => {
            screen.getByRole('button', { name: /apply/i }).click();
        });

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });
});
