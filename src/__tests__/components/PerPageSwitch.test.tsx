import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import PerPageSwitch from '../../components/ModelIndex/PerPageSwitch';

vi.mock('@luminix/core', () => ({
    app: vi.fn(() => ({})),
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@luminix/react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@luminix/react')>();
    return {
        ...actual,
        usePagination: vi.fn(() => ({ meta: { per_page: 15 } })),
        useApplyReducers: vi.fn((_service, _name, defaultValue) => defaultValue),
    };
});

function SearchParamsDisplay() {
    const [params] = useSearchParams();
    return <div data-testid="params">{params.toString()}</div>;
}

function renderPerPageSwitch() {
    render(
        <MemoryRouter>
            <PerPageSwitch />
            <SearchParamsDisplay />
        </MemoryRouter>
    );
}

describe('PerPageSwitch', () => {
    it('renders the rows-per-page label', () => {
        renderPerPageSwitch();
        expect(screen.getByText(/rows per page/i)).toBeInTheDocument();
    });

    it('renders the default per-page options', () => {
        renderPerPageSwitch();
        expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('changing selection updates per_page in searchParams', async () => {
        const user = userEvent.setup();
        renderPerPageSwitch();

        await user.click(screen.getByRole('combobox'));
        const option30 = await screen.findByRole('option', { name: '30' });
        await act(async () => {
            await user.click(option30);
        });

        expect(screen.getByTestId('params').textContent).toContain('per_page=30');
    });
});
