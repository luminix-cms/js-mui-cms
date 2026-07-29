import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReducibleCmsService, { CmsService } from '../../services/CmsService';
import type { RowClickHandler } from '../../types/Table';

const mockAuthLogout = vi.fn();

vi.mock('@luminix/core', () => ({
    auth: vi.fn(() => ({ logout: mockAuthLogout })),
    model: vi.fn(() => ({ make: vi.fn(() => ({})) })),
    ModelType: class {},
    Str: { studly: (s: string) => s },
}));

vi.mock('@luminix/support', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@luminix/support')>();
    return { ...actual };
});

vi.mock('@luminix/react', () => ({}));

const TestComponent = () => null;

let service: CmsService & Record<string, any>;

beforeEach(() => {
    service = new CmsService() as any;
    service.componentMap = vi.fn((acc: Record<string, any>) => ({
        ...acc,
        Layout: TestComponent,
        Dashboard: TestComponent,
        ModelIndex: TestComponent,
        ModelItem: TestComponent,
    }));
    service.cmsRoutes = vi.fn((acc: any[]) => acc);
    service.menuItems = vi.fn((acc: any[]) => [...acc, { key: 'home', text: 'Home' }]);
    service.wireModelFormProps = vi.fn((acc: any) => ({ ...acc, wired: true }));
    service.massActions = vi.fn((acc: any[]) => acc);
    service.instanceActions = vi.fn((acc: any[]) => acc);
    service.staticActions = vi.fn((acc: any[]) => acc);
    service.rowClickHandlers = vi.fn((acc: any[]) => acc);
    // Per-model action reducers
    service.massItemActions = vi.fn((acc: any[]) => acc);
    service.instanceItemActions = vi.fn((acc: any[]) => acc);
    service.staticItemActions = vi.fn((acc: any[]) => acc);
    service.rowItemClickHandlers = vi.fn((acc: any[]) => acc);
});

describe('CmsService.booted', () => {
    it('calls componentMap and stores the result', () => {
        service.booted();
        expect(service.componentMap).toHaveBeenCalledWith({});
        expect(service.getComponents()).toHaveProperty('Layout');
    });
});

describe('CmsService.getComponents', () => {
    it('returns the component map after boot', () => {
        service.booted();
        const components = service.getComponents();
        expect(components).toHaveProperty('Dashboard');
        expect(components).toHaveProperty('ModelIndex');
    });
});

describe('CmsService.getComponent', () => {
    it('returns a specific component by name', () => {
        service.booted();
        expect(service.getComponent('Layout')).toBe(TestComponent);
    });

    it('returns undefined for an unknown component', () => {
        service.booted();
        expect(service.getComponent('NonExistent')).toBeUndefined();
    });
});

describe('CmsService.getRoutes', () => {
    it('calls cmsRoutes and returns the result', () => {
        service.booted();
        const routes = service.getRoutes();
        expect(service.cmsRoutes).toHaveBeenCalled();
        expect(Array.isArray(routes)).toBe(true);
    });
});

describe('CmsService.getMenuItems', () => {
    it('calls menuItems and returns the result', () => {
        service.booted();
        const items = service.getMenuItems();
        expect(service.menuItems).toHaveBeenCalled();
        expect(Array.isArray(items)).toBe(true);
    });
});

describe('CmsService.getModelFormProps', () => {
    it('calls wireModelFormProps with the item and returns props', () => {
        const item = { id: 1 } as any;
        const result = service.getModelFormProps(item);
        expect(service.wireModelFormProps).toHaveBeenCalledWith({}, item);
        expect(result).toHaveProperty('wired', true);
    });
});

describe('CmsService.getMassActions', () => {
    it('calls massActions and the per-model reducer', () => {
        const ModelClass = {
            getSchemaName: () => 'item',
        } as any;
        service.getMassActions(ModelClass, 'all');
        expect(service.massActions).toHaveBeenCalled();
        expect(service.massItemActions).toHaveBeenCalled();
    });
});

describe('CmsService.getInstanceActions', () => {
    it('calls instanceActions and the per-model reducer', () => {
        const ModelClass = {
            getSchemaName: () => 'item',
        } as any;
        service.getInstanceActions(ModelClass, 'all');
        expect(service.instanceActions).toHaveBeenCalled();
        expect(service.instanceItemActions).toHaveBeenCalled();
    });
});

describe('CmsService.getStaticActions', () => {
    it('calls staticActions and the per-model reducer', () => {
        const ModelClass = {
            getSchemaName: () => 'item',
        } as any;
        service.getStaticActions(ModelClass, 'all');
        expect(service.staticActions).toHaveBeenCalled();
        expect(service.staticItemActions).toHaveBeenCalled();
    });
});

describe('CmsService.getRowClickHandlers', () => {
    it('calls rowClickHandlers and the per-model reducer', () => {
        const ModelClass = {
            getSchemaName: () => 'item',
        } as any;
        service.getRowClickHandlers(ModelClass, { getKey: () => 1 } as any);
        expect(service.rowClickHandlers).toHaveBeenCalled();
        expect(service.rowItemClickHandlers).toHaveBeenCalled();
    });

    it('passes the model class and the item to both reducers', () => {
        const ModelClass = {
            getSchemaName: () => 'item',
        } as any;
        const item = { getKey: () => 1 } as any;
        service.getRowClickHandlers(ModelClass, item);
        expect(service.rowClickHandlers.mock.calls[0].slice(1)).toEqual([ModelClass, item]);
        expect(service.rowItemClickHandlers.mock.calls[0].slice(1)).toEqual([ModelClass, item]);
    });
});

describe('CmsService row click handlers — with the real reducer machinery', () => {

    const makeModelClass = (schemaName: string) => ({ getSchemaName: () => schemaName } as any);
    const item = { getKey: () => 1 } as any;

    // Stands in for what CmsServiceProvider.bootRowClickHandlers registers.
    const defaultHandler: RowClickHandler = vi.fn();

    let cms: any;

    beforeEach(() => {
        cms = new ReducibleCmsService();
        cms.reducer('rowClickHandlers', (handlers: RowClickHandler[]) => [...handlers, defaultHandler], 0);
    });

    it('resolves the default handler for any model', () => {
        expect(cms.getRowClickHandlers(makeModelClass('user'), item)).toEqual([defaultHandler]);
        expect(cms.getRowClickHandlers(makeModelClass('post'), item)).toEqual([defaultHandler]);
    });

    it('onRowClick appends a handler for every model', () => {
        const handler = vi.fn();
        cms.onRowClick(handler);
        expect(cms.getRowClickHandlers(makeModelClass('user'), item)).toEqual([defaultHandler, handler]);
        expect(cms.getRowClickHandlers(makeModelClass('post'), item)).toEqual([defaultHandler, handler]);
    });

    it('onRowClick with a model name only affects that model', () => {
        const handler = vi.fn();
        cms.onRowClick(handler, 'user');
        expect(cms.getRowClickHandlers(makeModelClass('user'), item)).toEqual([defaultHandler, handler]);
        expect(cms.getRowClickHandlers(makeModelClass('post'), item)).toEqual([defaultHandler]);
    });

    it('onRowClick honours the priority argument', () => {
        const first = vi.fn();
        cms.onRowClick(first, undefined, -1);
        expect(cms.getRowClickHandlers(makeModelClass('user'), item)).toEqual([first, defaultHandler]);
    });

    it('the unsubscribe returned by onRowClick removes only that handler', () => {
        const a = vi.fn();
        const b = vi.fn();
        const unsubscribe = cms.onRowClick(a);
        cms.onRowClick(b);
        unsubscribe();
        expect(cms.getRowClickHandlers(makeModelClass('user'), item)).toEqual([defaultHandler, b]);
    });

    it('clearRowClickHandlers() removes every handler of every model', () => {
        cms.onRowClick(vi.fn());
        cms.clearRowClickHandlers();
        expect(cms.getRowClickHandlers(makeModelClass('user'), item)).toEqual([]);
        expect(cms.getRowClickHandlers(makeModelClass('post'), item)).toEqual([]);
    });

    it('clearRowClickHandlers(model) drops the default for that model only', () => {
        cms.clearRowClickHandlers('user');
        expect(cms.getRowClickHandlers(makeModelClass('user'), item)).toEqual([]);
        expect(cms.getRowClickHandlers(makeModelClass('post'), item)).toEqual([defaultHandler]);
    });

    it('clearRowClickHandlers(model) also drops handlers previously added for that model', () => {
        cms.onRowClick(vi.fn(), 'user');
        cms.clearRowClickHandlers('user');
        expect(cms.getRowClickHandlers(makeModelClass('user'), item)).toEqual([]);
    });

    it('replaces the behaviour of a single model when cleared then re-registered', () => {
        const custom = vi.fn();
        cms.clearRowClickHandlers('user');
        cms.onRowClick(custom, 'user');
        expect(cms.getRowClickHandlers(makeModelClass('user'), item)).toEqual([custom]);
        expect(cms.getRowClickHandlers(makeModelClass('post'), item)).toEqual([defaultHandler]);
    });

    it('clearRowClickHandlers(model) is idempotent', () => {
        const custom = vi.fn();
        cms.clearRowClickHandlers('user');
        cms.clearRowClickHandlers('user');
        cms.onRowClick(custom, 'user');
        expect(cms.getRowClickHandlers(makeModelClass('user'), item)).toEqual([custom]);
    });

    it('passes the model class and the item down to the registered reducers', () => {
        const spy = vi.fn((handlers: RowClickHandler[]) => handlers);
        cms.reducer('rowUserClickHandlers', spy);
        const ModelClass = makeModelClass('user');
        cms.getRowClickHandlers(ModelClass, item);
        expect(spy.mock.calls[0][1]).toBe(ModelClass);
        expect(spy.mock.calls[0][2]).toBe(item);
    });
});

describe('CmsService.logoutUsing / getLogoutCallback', () => {
    it('getLogoutCallback returns a function that calls auth().logout() by default', () => {
        mockAuthLogout.mockClear();
        const callback = service.getLogoutCallback();
        expect(typeof callback).toBe('function');
        callback();
        expect(mockAuthLogout).toHaveBeenCalledTimes(1);
    });

    it('logoutUsing registers a custom callback returned by getLogoutCallback', () => {
        const custom = vi.fn();
        service.logoutUsing(custom);
        const callback = service.getLogoutCallback();
        expect(callback).toBe(custom);
    });

    it('custom callback overrides the default auth().logout()', () => {
        mockAuthLogout.mockClear();
        const custom = vi.fn();
        service.logoutUsing(custom);
        service.getLogoutCallback()();
        expect(custom).toHaveBeenCalledTimes(1);
        expect(mockAuthLogout).not.toHaveBeenCalled();
    });
});
