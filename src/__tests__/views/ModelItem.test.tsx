import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ModelItem from '../../views/ModelItem';
import LayoutContext from '../../contexts/LayoutContext';
import ModelContext from '../../contexts/ModelContext';
import NotificationContext from '../../contexts/NotificationContext';

// Hoisted so vi.mock factories can reference them (no TDZ)
const mockNavigate = vi.hoisted(() => vi.fn());
const MockBreadcrumbs = vi.hoisted(() => vi.fn());
const MockModelForm = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@luminix/core', () => ({
    app: vi.fn(() => ({
        getComponent: vi.fn(() => MockBreadcrumbs),
        getModelFormProps: vi.fn(() => ({})),
    })),
    ModelType: class {},
}));

vi.mock('@luminix/react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@luminix/react')>();
    return { ...actual, ModelForm: MockModelForm };
});

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

// Set JSX implementations at module level (React is available here)
MockBreadcrumbs.mockImplementation(() => <div data-testid="breadcrumbs" />);
MockModelForm.mockImplementation(({ onSuccess }: { onSuccess: () => void }) => (
    <div data-testid="model-form">
        <button data-testid="save-btn" onClick={onSuccess}>Save</button>
    </div>
));

// Mutable state to control what new MockModel() produces
let instanceConfig: Record<string, unknown> = {};

const makeFetchedItem = (overrides: Record<string, unknown> = {}) => ({
    exists: true,
    wasRecentlyCreated: false,
    getLabel: () => 'Test',
    getKey: () => '42',
    getType: () => 'item',
    ...overrides,
});

class MockModel {
    exists: boolean;
    wasRecentlyCreated: boolean;
    getLabel: () => string;
    getKey: () => string;
    getType: () => string;

    constructor() {
        this.exists = (instanceConfig.exists as boolean) ?? false;
        this.wasRecentlyCreated = (instanceConfig.wasRecentlyCreated as boolean) ?? false;
        this.getLabel = () => (instanceConfig.label as string) ?? '';
        this.getKey = () => (instanceConfig.key as string) ?? '1';
        this.getType = () => 'item';
    }

    static find = vi.fn();
    static plural = vi.fn(() => 'Items');
    static singular = vi.fn(() => 'Item');
    static getSchema = vi.fn(() => ({}));
    static getSchemaName = vi.fn(() => 'item');
}

const layoutValue = {
    open: false, setOpen: vi.fn(), layout: { breakpoint: 'md' },
    isBreakpointUp: false, currentPage: '',
    setCurrentPage: vi.fn(), showSearch: false,
    setShowSearch: vi.fn(), showBackButton: false,
    setShowBackButton: vi.fn(),
};

function renderModelItem({ create = false, id = '1', notify = vi.fn() } = {}) {
    return render(
        <MemoryRouter initialEntries={[`/items/${id}`]}>
            <Routes>
                <Route path="/items/:id" element={
                    <LayoutContext.Provider value={{ ...layoutValue, setCurrentPage: vi.fn() }}>
                        <NotificationContext.Provider value={{
                            isOpen: false, notify, dismissNotification: vi.fn(),
                            notifications: [], current: undefined,
                            displacement: '8px', setDisplacement: vi.fn(),
                        }}>
                            <ModelContext.Provider value={{ Model: MockModel as never }}>
                                <ModelItem create={create} />
                            </ModelContext.Provider>
                        </NotificationContext.Provider>
                    </LayoutContext.Provider>
                } />
            </Routes>
        </MemoryRouter>
    );
}

describe('ModelItem', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        instanceConfig = {};
        MockModel.find = vi.fn().mockResolvedValue(makeFetchedItem());
        MockModel.plural = vi.fn(() => 'Items');
        MockModel.singular = vi.fn(() => 'Item');
        MockBreadcrumbs.mockImplementation(() => <div data-testid="breadcrumbs" />);
        MockModelForm.mockImplementation(({ onSuccess }: { onSuccess: () => void }) => (
            <div data-testid="model-form">
                <button data-testid="save-btn" onClick={onSuccess}>Save</button>
            </div>
        ));
    });

    it('returns null before item is loaded in edit mode', () => {
        MockModel.find = vi.fn(() => new Promise(() => {}));
        const { container } = renderModelItem({ create: false });
        expect(container.firstChild).toBeNull();
    });

    it('renders the form in create mode', async () => {
        renderModelItem({ create: true });
        await waitFor(() => {
            expect(screen.getByTestId('model-form')).toBeInTheDocument();
        });
    });

    it('renders the form after Model.find resolves in edit mode', async () => {
        renderModelItem({ create: false, id: '42' });
        await waitFor(() => {
            expect(screen.getByTestId('model-form')).toBeInTheDocument();
        });
        expect(MockModel.find).toHaveBeenCalledWith('42');
    });

    it('calls notify on successful save', async () => {
        const notify = vi.fn();
        renderModelItem({ create: true, notify });
        await waitFor(() => screen.getByTestId('save-btn'));
        await act(async () => {
            screen.getByTestId('save-btn').click();
        });
        expect(notify).toHaveBeenCalled();
    });

    it('replaces the create route after a successful create', async () => {
        instanceConfig = { wasRecentlyCreated: true, key: '99' };
        renderModelItem({ create: true });
        await waitFor(() => screen.getByTestId('save-btn'));
        await act(async () => {
            screen.getByTestId('save-btn').click();
        });
        expect(mockNavigate).toHaveBeenCalledWith('/items/99', { replace: true });
    });
});
