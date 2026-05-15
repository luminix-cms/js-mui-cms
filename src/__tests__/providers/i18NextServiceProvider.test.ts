import { describe, it, expect, vi, beforeAll } from 'vitest';
import type { MassAction, StaticAction } from '../../types/Table';
import type { MenuItem } from '../../types/Menu';

const reducers = vi.hoisted(() => new Map<string, Function>());

vi.mock('i18next', () => ({
    default: {
        use: vi.fn().mockReturnThis(),
        init: vi.fn(),
        t: vi.fn((key: string) => `[t] ${key}`),
    },
}));

vi.mock('react-i18next', () => ({
    initReactI18next: {},
}));

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
    Model: {
        reducer: vi.fn(),
        make: vi.fn(() => ({})),
    },
}));

vi.mock('@luminix/react', () => ({
    Forms: { reducer: vi.fn((name: string, fn: Function) => { reducers.set(name, fn); }) },
}));

vi.mock('../../facades/Cms', () => ({
    default: {
        reducer: vi.fn((name: string, fn: Function) => { reducers.set(name, fn); }),
    },
}));

const mockApp = vi.hoisted(() => ({
    singleton: vi.fn(),
    on: vi.fn(),
    once: vi.fn((_event: string, handler: Function) => handler()),
}));

beforeAll(async () => {
    const { default: I18NextServiceProvider } = await import('../../providers/i18NextServiceProvider');
    const provider = new I18NextServiceProvider(mockApp as any);
    provider.register();
    provider.boot();
});

describe('i18NextServiceProvider — translateMassActions', () => {
    it('translates the label of each mass action', () => {
        const fn = reducers.get('massActions')!;
        const actions: MassAction[] = [
            { key: 'delete', label: 'Delete', callback: vi.fn() },
            { key: 'restore', label: 'Restore', callback: vi.fn() },
        ];
        const result: MassAction[] = fn(actions);
        expect(result[0].label).toBe('[t] Delete');
        expect(result[1].label).toBe('[t] Restore');
    });

    it('preserves other action properties unchanged', () => {
        const fn = reducers.get('massActions')!;
        const cb = vi.fn();
        const result: MassAction[] = fn([{ key: 'delete', label: 'Delete', callback: cb }]);
        expect(result[0].key).toBe('delete');
        expect(result[0].callback).toBe(cb);
    });
});

describe('i18NextServiceProvider — translateStaticActions', () => {
    it('translates the create action label', () => {
        const fn = reducers.get('staticActions')!;
        const MockClass = { singular: vi.fn(() => 'Item') } as any;
        const actions: StaticAction[] = [{ key: 'create', label: 'Create Item', callback: vi.fn() }];
        const result: StaticAction[] = fn(actions, MockClass);
        expect(result[0].label).toBe('[t] Create :model');
    });

    it('returns actions unchanged when there is no create action', () => {
        const fn = reducers.get('staticActions')!;
        const MockClass = { singular: vi.fn(() => 'Item') } as any;
        const actions: StaticAction[] = [{ key: 'export', label: 'Export', callback: vi.fn() }];
        const result: StaticAction[] = fn(actions, MockClass);
        expect(result[0].label).toBe('Export');
    });
});

describe('i18NextServiceProvider — translateMenuEntries', () => {
    it('translates the dashboard menu entry text', () => {
        const fn = reducers.get('menuItems')!;
        const items: MenuItem[] = [
            { key: 'dashboard', text: 'Dashboard', icon: null },
            { key: 'users', text: 'Users', icon: null },
        ];
        const result: MenuItem[] = fn(items);
        expect(result.find((i) => i.key === 'dashboard')!.text).toBe('[t] Dashboard');
    });

    it('does not modify non-dashboard entries', () => {
        const fn = reducers.get('menuItems')!;
        const items: MenuItem[] = [{ key: 'users', text: 'Users', icon: null }];
        const result: MenuItem[] = fn(items);
        expect(result[0].text).toBe('Users');
    });
});

describe('i18NextServiceProvider — translateFormLabels', () => {
    it('translates the label of a single input props object', () => {
        const fn = reducers.get('getDefaultInputProps')!;
        const result = fn({ label: 'Name', name: 'name' });
        expect(result.label).toBe('[t] Name');
    });

    it('translates labels when props is an array', () => {
        const fn = reducers.get('getDefaultInputProps')!;
        const result = fn([{ label: 'Name', name: 'name' }, { label: 'Email', name: 'email' }]);
        expect(result[0].label).toBe('[t] Name');
        expect(result[1].label).toBe('[t] Email');
    });

    it('passes through undefined label without error', () => {
        const fn = reducers.get('getDefaultInputProps')!;
        const result = fn({ name: 'age' });
        expect(result.label).toBeUndefined();
    });
});

describe('i18NextServiceProvider — register', () => {
    it('hooks into the booting event', () => {
        expect(mockApp.once).toHaveBeenCalledWith('booting', expect.any(Function));
    });
});
