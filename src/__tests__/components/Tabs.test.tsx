import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import Tabs from '../../components/ModelIndex/Tabs';
import ModelContext from '../../contexts/ModelContext';
import LayoutContext from '../../contexts/LayoutContext';

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
        useApplyReducers: vi.fn((_service, _name, defaultValue) => defaultValue),
    };
});

const mockModelWithSoftDeletes = {
    getSchema: () => ({ softDeletes: true }),
    getSchemaName: () => 'user',
    singular: () => 'User',
    plural: () => 'Users',
};

const mockModelWithoutSoftDeletes = {
    getSchema: () => ({ softDeletes: false }),
    getSchemaName: () => 'product',
    singular: () => 'Product',
    plural: () => 'Products',
};

const layoutValue = {
    open: false, setOpen: vi.fn(), layout: {},
    isBreakpointUp: false, currentPage: '',
    setCurrentPage: vi.fn(), showSearch: false,
    setShowSearch: vi.fn(), showBackButton: false,
    setShowBackButton: vi.fn(),
};

function SearchParamsDisplay() {
    const [params] = useSearchParams();
    return <div data-testid="params">{params.toString()}</div>;
}

function renderTabs(model: typeof mockModelWithSoftDeletes | typeof mockModelWithoutSoftDeletes) {
    return render(
        <MemoryRouter>
            <LayoutContext.Provider value={layoutValue}>
                <ModelContext.Provider value={{ Model: model as never }}>
                    <Tabs />
                    <SearchParamsDisplay />
                </ModelContext.Provider>
            </LayoutContext.Provider>
        </MemoryRouter>
    );
}

describe('Tabs', () => {
    it('renders "All" tab for a model with soft deletes', () => {
        renderTabs(mockModelWithSoftDeletes);
        expect(screen.getByRole('tab', { name: 'All' })).toBeInTheDocument();
    });

    it('renders "Trashed" tab for a model with soft deletes', () => {
        renderTabs(mockModelWithSoftDeletes);
        expect(screen.getByRole('tab', { name: 'Trashed' })).toBeInTheDocument();
    });

    it('does not render when the model has no soft deletes and no extra tabs', () => {
        renderTabs(mockModelWithoutSoftDeletes);
        expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    });

    it('clicking a tab updates the "tab" searchParam', async () => {
        renderTabs(mockModelWithSoftDeletes);
        await act(async () => {
            screen.getByRole('tab', { name: 'Trashed' }).click();
        });
        expect(screen.getByTestId('params').textContent).toContain('tab=trashed');
    });

    it('clicking the "All" tab removes the tab searchParam', async () => {
        renderTabs(mockModelWithSoftDeletes);
        await act(async () => {
            screen.getByRole('tab', { name: 'Trashed' }).click();
        });
        await act(async () => {
            screen.getByRole('tab', { name: 'All' }).click();
        });
        expect(screen.getByTestId('params').textContent).not.toContain('tab=');
    });
});
