import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import { Collection } from '@luminix/support';
import Sort from '../../components/ModelIndex/Sort';
import TableContext from '../../contexts/TableContext';

vi.mock('@luminix/core', () => ({
    collect: vi.fn((items: unknown[]) => new Collection(items)),
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

const mockModel = { plural: () => 'Users' };

const sortableColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'created_at', label: 'Created', sortable: false },
];

function SearchParamsDisplay() {
    const [params] = useSearchParams();
    return <div data-testid="search-params">{params.toString()}</div>;
}

function renderSort(initialUrl = '/') {
    render(
        <MemoryRouter initialEntries={[initialUrl]}>
            <TableContext.Provider value={{
                columns: sortableColumns,
                columnCount: sortableColumns.length,
                selected: { count: () => 0 } as never,
                massActions: [],
                error: new Error(),
                Model: mockModel as never,
            }}>
                <Sort />
                <SearchParamsDisplay />
            </TableContext.Provider>
        </MemoryRouter>
    );
}

describe('Sort', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the sort icon button', () => {
        renderSort();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('opens a dialog when the sort button is clicked', async () => {
        renderSort();
        await act(async () => {
            screen.getByRole('button').click();
        });
        expect(screen.getByText('Sort :model')).toBeInTheDocument();
    });

    it('renders only sortable columns in the dialog', async () => {
        renderSort();
        await act(async () => {
            screen.getByRole('button').click();
        });
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.queryByText('Created')).not.toBeInTheDocument();
    });

    it('Apply button sets order_by in searchParams', async () => {
        const user = userEvent.setup();
        renderSort();

        await act(async () => {
            screen.getByRole('button').click();
        });

        await user.click(screen.getByRole('radio', { name: 'Name' }));
        await user.click(screen.getByRole('radio', { name: /Ascending/i }));
        await act(async () => {
            screen.getByText('Apply').click();
        });

        expect(screen.getByTestId('search-params').textContent).toContain('order_by=name%3Aasc');
    });

    it('Clear button removes order_by from searchParams', async () => {
        const user = userEvent.setup();
        renderSort('/users?order_by=name%3Aasc');

        await act(async () => {
            screen.getByRole('button').click();
        });

        await user.click(screen.getByText('Clear'));

        expect(screen.getByTestId('search-params').textContent).not.toContain('order_by');
    });
});
