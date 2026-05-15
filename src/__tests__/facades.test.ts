import { describe, it, expect, vi } from 'vitest';

vi.mock('@luminix/support', () => ({
    MakeFacade: vi.fn((FacadeClass: new () => { getFacadeAccessor: () => string }) => {
        const instance = new FacadeClass();
        instance.getFacadeAccessor();
        return instance;
    }),
    HasFacadeAccessor: class {},
}));

vi.mock('@luminix/core', () => ({
    App: {},
}));

describe('Facades', () => {
    it('Cms facade is created with MakeFacade', async () => {
        const { default: Cms } = await import('../facades/Cms');
        expect(Cms).toBeDefined();
    });

    it('Filter facade is created with MakeFacade', async () => {
        const { default: Filter } = await import('../facades/Filter');
        expect(Filter).toBeDefined();
    });

    it('Icon facade is created with MakeFacade', async () => {
        const { default: Icon } = await import('../facades/Icon');
        expect(Icon).toBeDefined();
    });
});
