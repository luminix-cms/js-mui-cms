import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CmsService } from '../../services/CmsService';

vi.mock('@luminix/core', () => ({
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
    // Per-model action reducers
    service.massItemActions = vi.fn((acc: any[]) => acc);
    service.instanceItemActions = vi.fn((acc: any[]) => acc);
    service.staticItemActions = vi.fn((acc: any[]) => acc);
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
