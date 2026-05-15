import { describe, it, expect, vi, beforeAll } from 'vitest';
import type { MassAction, InstanceAction, StaticAction } from '../../types/Table';
import type { MenuItem } from '../../types/Menu';

// All reducer callbacks captured by name during boot()
const reducers = vi.hoisted(() => new Map<string, Function>());

vi.mock('@luminix/support', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@luminix/support')>();
    return {
        ...actual,
        ServiceProvider: class {
            protected app: any;
            constructor(app: any) { this.app = app; }
        },
    };
});

vi.mock('@luminix/core', () => ({
    Config: { get: vi.fn((_key: string, def: unknown) => def) },
    collect: vi.fn((items: unknown[] = []) => ({
        count: () => items.length,
        isEmpty: () => items.length === 0,
    })),
    Model: { reducer: vi.fn(), make: vi.fn(() => ({})) },
    ModelType: class {},
    Route: { reducer: vi.fn() },
}));

vi.mock('@luminix/react', () => ({}));

vi.mock('../../facades/Cms', () => ({
    default: {
        reducer: vi.fn((name: string, fn: Function) => { reducers.set(name, fn); }),
    },
}));

vi.mock('../../facades/Icon', () => ({
    default: {
        registerIcon: vi.fn(),
        forModel: vi.fn(),
        render: vi.fn((name: string) => name),
    },
}));

vi.mock('../../services/CmsService', () => ({
    default: class { booted() {} },
}));
vi.mock('../../services/FilterService', () => ({ default: class {} }));
vi.mock('../../services/IconService', () => ({ default: class {} }));
vi.mock('../../routes', () => ({ default: [] }));

vi.mock('../../support/handlers', () => ({
    massActionHandlers: {
        delete: vi.fn(() => vi.fn()),
        restore: vi.fn(() => vi.fn()),
        forceDelete: vi.fn(() => vi.fn()),
    },
    instanceActionHandlers: {
        delete: vi.fn(() => vi.fn()),
        restore: vi.fn(() => vi.fn()),
        forceDelete: vi.fn(() => vi.fn()),
    },
    staticActionHandlers: {
        create: vi.fn(() => vi.fn()),
    },
}));

const mockApp = vi.hoisted(() => ({
    singleton: vi.fn(),
    make: vi.fn(() => ({ booted: vi.fn() })),
    on: vi.fn((_event: string, handler: Function) => handler()),
    once: vi.fn(),
}));

const ModelWithSoftDeletes = { getSchema: () => ({ softDeletes: true }) } as any;
const ModelWithoutSoftDeletes = { getSchema: () => ({ softDeletes: false }) } as any;

beforeAll(async () => {
    const { default: CmsServiceProvider } = await import('../../providers/CmsServiceProvider');
    const provider = new CmsServiceProvider(mockApp as any);
    provider.register();
    provider.boot();
});

describe('CmsServiceProvider.register', () => {
    it('registers the cms singleton', () => {
        expect(mockApp.singleton).toHaveBeenCalledWith('cms', expect.any(Function));
    });

    it('registers the filter singleton', () => {
        expect(mockApp.singleton).toHaveBeenCalledWith('filter', expect.any(Function));
    });

    it('registers the icon singleton', () => {
        expect(mockApp.singleton).toHaveBeenCalledWith('icon', expect.any(Function));
    });
});

describe('CmsServiceProvider — bootComponents', () => {
    it('registers all core component keys in the componentMap', () => {
        const fn = reducers.get('componentMap')!;
        const map = fn();
        expect(map).toHaveProperty('Layout');
        expect(map).toHaveProperty('Dashboard');
        expect(map).toHaveProperty('ModelIndex');
        expect(map).toHaveProperty('ModelItem');
        expect(map).toHaveProperty('ModelIndex.Pagination');
        expect(map).toHaveProperty('ModelIndex.Table');
    });
});

describe('CmsServiceProvider — bootMassActions', () => {
    it('adds a "delete" action for non-trashed tab with soft-delete model (label: Send to trash)', () => {
        const fn = reducers.get('massActions')!;
        const result: MassAction[] = fn([], ModelWithSoftDeletes, 'all');
        expect(result).toHaveLength(1);
        expect(result[0].key).toBe('delete');
        expect(result[0].label).toBe('Send to trash');
    });

    it('adds a "delete" action labeled "Delete permanently" for non-soft-delete model', () => {
        const fn = reducers.get('massActions')!;
        const result: MassAction[] = fn([], ModelWithoutSoftDeletes, 'all');
        expect(result[0].key).toBe('delete');
        expect(result[0].label).toBe('Delete permanently');
    });

    it('adds restore and forceDelete actions for the trashed tab', () => {
        const fn = reducers.get('massActions')!;
        const result: MassAction[] = fn([], ModelWithSoftDeletes, 'trashed');
        expect(result).toHaveLength(2);
        expect(result[0].key).toBe('restore');
        expect(result[1].key).toBe('forceDelete');
    });

    it('appends to existing actions', () => {
        const fn = reducers.get('massActions')!;
        const existing: MassAction[] = [{ key: 'custom', label: 'Custom', callback: vi.fn() }];
        const result: MassAction[] = fn(existing, ModelWithoutSoftDeletes, 'all');
        expect(result).toHaveLength(2);
        expect(result[0].key).toBe('custom');
    });
});

describe('CmsServiceProvider — bootInstanceActions', () => {
    it('adds a delete action for non-trashed tab', () => {
        const fn = reducers.get('instanceActions')!;
        const result: InstanceAction[] = fn([], ModelWithSoftDeletes, 'all');
        expect(result).toHaveLength(1);
        expect(result[0].label).toBe('Send to trash');
    });

    it('adds restore and forceDelete for trashed tab', () => {
        const fn = reducers.get('instanceActions')!;
        const result: InstanceAction[] = fn([], ModelWithSoftDeletes, 'trashed');
        expect(result).toHaveLength(2);
        expect(result[0].label).toBe('Restore');
        expect(result[1].label).toBe('Delete permanently');
    });
});

describe('CmsServiceProvider — bootStaticActions', () => {
    it('adds a create action for non-trashed tab', () => {
        const fn = reducers.get('staticActions')!;
        const MockClass = { singular: () => 'Item', getSchema: () => ({}) } as any;
        const result: StaticAction[] = fn([], MockClass, 'all');
        expect(result).toHaveLength(1);
        expect(result[0].key).toBe('create');
    });

    it('does not add any action for the trashed tab', () => {
        const fn = reducers.get('staticActions')!;
        const MockClass = { singular: () => 'Item', getSchema: () => ({}) } as any;
        const result: StaticAction[] = fn([], MockClass, 'trashed');
        expect(result).toHaveLength(0);
    });
});

describe('CmsServiceProvider — bootMenu', () => {
    it('always adds a dashboard menu item', () => {
        const fn = reducers.get('menuItems')!;
        const result: MenuItem[] = fn([], {});
        expect(result[0].key).toBe('dashboard');
        expect(result[0].to).toBe('/');
    });

    it('adds menu items for each model sorted alphabetically by key', () => {
        const fn = reducers.get('menuItems')!;
        const models = {
            zebra: { plural: () => 'Zebras', icon: () => null },
            apple: { plural: () => 'Apples', icon: () => null },
        };
        const result: MenuItem[] = fn([], models);
        // index 0 = dashboard, 1 = apple, 2 = zebra
        expect(result[1].key).toBe('apple');
        expect(result[2].key).toBe('zebra');
    });

    it('appends model items after existing menu entries', () => {
        const fn = reducers.get('menuItems')!;
        const existing: MenuItem[] = [{ key: 'existing', text: 'Existing', icon: null }];
        const result: MenuItem[] = fn(existing, {});
        expect(result[0].key).toBe('existing');
        expect(result[1].key).toBe('dashboard');
    });
});
