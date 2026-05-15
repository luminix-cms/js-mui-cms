import { describe, it, expect, vi, beforeEach } from 'vitest';
import { massActionHandlers, instanceActionHandlers, staticActionHandlers } from '../../support/handlers';

vi.mock('@luminix/core', () => ({
    Model: class {},
}));

vi.mock('axios', () => ({
    isAxiosError: vi.fn(() => false),
}));

const makeSelected = (count: number, pk = 'id') => ({
    count: () => count,
    pluck: vi.fn(() => ({ all: () => [1, 2, 3].slice(0, count) })),
});

const makeItem = (label = 'Test Item') => ({
    getLabel: () => label,
    delete: vi.fn().mockResolvedValue(undefined),
    restore: vi.fn().mockResolvedValue(undefined),
    forceDelete: vi.fn().mockResolvedValue(undefined),
});

const makeModelClass = (softDeletes = false) => ({
    getSchema: () => ({ softDeletes, primaryKey: 'id' }),
    singular: () => 'Item',
    plural: () => 'Items',
    delete: vi.fn().mockResolvedValue(undefined),
    restore: vi.fn().mockResolvedValue(undefined),
    forceDelete: vi.fn().mockResolvedValue(undefined),
} as any);

const makeCtx = (overrides: Partial<{ notify: any; dialog: any; refresh: any; t: any }> = {}) => ({
    notify: vi.fn(),
    dialog: vi.fn().mockResolvedValue(true),
    refresh: vi.fn(),
    t: (s: string) => s,
    ...overrides,
});

describe('massActionHandlers.delete', () => {
    it('calls dialog and deletes items when confirmed (no soft deletes)', async () => {
        const ModelClass = makeModelClass(false);
        const selected = makeSelected(2);
        const ctx = makeCtx();
        await massActionHandlers.delete(ModelClass)({ ...ctx, selected } as any);
        expect(ctx.dialog).toHaveBeenCalledWith(expect.objectContaining({ type: 'confirm' }));
        expect(ModelClass.delete).toHaveBeenCalled();
        expect(ctx.notify).toHaveBeenCalled();
        expect(ctx.refresh).toHaveBeenCalled();
    });

    it('uses "Send to trash" label when softDeletes is true', async () => {
        const ModelClass = makeModelClass(true);
        const selected = makeSelected(1);
        const ctx = makeCtx();
        await massActionHandlers.delete(ModelClass)({ ...ctx, selected } as any);
        expect(ctx.dialog).toHaveBeenCalledWith(
            expect.objectContaining({ title: 'Confirm send to trash' })
        );
        expect(ModelClass.delete).toHaveBeenCalled();
    });

    it('does not delete when dialog is cancelled', async () => {
        const ModelClass = makeModelClass(false);
        const selected = makeSelected(1);
        const ctx = makeCtx({ dialog: vi.fn().mockResolvedValue(false) });
        await massActionHandlers.delete(ModelClass)({ ...ctx, selected } as any);
        expect(ModelClass.delete).not.toHaveBeenCalled();
        expect(ctx.refresh).not.toHaveBeenCalled();
    });

    it('calls notify with error when delete throws', async () => {
        const ModelClass = makeModelClass(false);
        ModelClass.delete = vi.fn().mockRejectedValue(new Error('Network error'));
        const selected = makeSelected(1);
        const ctx = makeCtx();
        await massActionHandlers.delete(ModelClass)({ ...ctx, selected } as any);
        expect(ctx.notify).toHaveBeenCalledWith(
            expect.objectContaining({ severity: 'error' })
        );
        expect(ctx.refresh).not.toHaveBeenCalled();
    });
});

describe('massActionHandlers.restore', () => {
    it('restores selected items when confirmed', async () => {
        const ModelClass = makeModelClass(true);
        const selected = makeSelected(3);
        const ctx = makeCtx();
        await massActionHandlers.restore(ModelClass)({ ...ctx, selected } as any);
        expect(ctx.dialog).toHaveBeenCalledWith(
            expect.objectContaining({ title: 'Confirm restore' })
        );
        expect(ModelClass.restore).toHaveBeenCalled();
        expect(ctx.notify).toHaveBeenCalled();
        expect(ctx.refresh).toHaveBeenCalled();
    });

    it('does not restore when dialog is cancelled', async () => {
        const ModelClass = makeModelClass(true);
        const selected = makeSelected(1);
        const ctx = makeCtx({ dialog: vi.fn().mockResolvedValue(false) });
        await massActionHandlers.restore(ModelClass)({ ...ctx, selected } as any);
        expect(ModelClass.restore).not.toHaveBeenCalled();
    });

    it('calls notify with error when restore throws', async () => {
        const ModelClass = makeModelClass(true);
        ModelClass.restore = vi.fn().mockRejectedValue(new Error('fail'));
        const selected = makeSelected(1);
        const ctx = makeCtx();
        await massActionHandlers.restore(ModelClass)({ ...ctx, selected } as any);
        expect(ctx.notify).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
    });
});

describe('massActionHandlers.forceDelete', () => {
    it('permanently deletes when confirmed', async () => {
        const ModelClass = makeModelClass(true);
        const selected = makeSelected(2);
        const ctx = makeCtx();
        await massActionHandlers.forceDelete(ModelClass)({ ...ctx, selected } as any);
        expect(ctx.dialog).toHaveBeenCalledWith(
            expect.objectContaining({ title: 'Confirm permanent deletion' })
        );
        expect(ModelClass.forceDelete).toHaveBeenCalled();
        expect(ctx.refresh).toHaveBeenCalled();
    });

    it('does not forceDelete when dialog is cancelled', async () => {
        const ModelClass = makeModelClass(true);
        const selected = makeSelected(1);
        const ctx = makeCtx({ dialog: vi.fn().mockResolvedValue(false) });
        await massActionHandlers.forceDelete(ModelClass)({ ...ctx, selected } as any);
        expect(ModelClass.forceDelete).not.toHaveBeenCalled();
    });

    it('calls notify with error when forceDelete throws', async () => {
        const ModelClass = makeModelClass(true);
        ModelClass.forceDelete = vi.fn().mockRejectedValue(new Error('fail'));
        const selected = makeSelected(1);
        const ctx = makeCtx();
        await massActionHandlers.forceDelete(ModelClass)({ ...ctx, selected } as any);
        expect(ctx.notify).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
    });
});

describe('instanceActionHandlers.delete', () => {
    it('deletes the item when confirmed (no soft deletes)', async () => {
        const ModelClass = makeModelClass(false);
        const item = makeItem('My Item');
        const ctx = makeCtx();
        await instanceActionHandlers.delete(ModelClass)({ ...ctx, item } as any);
        expect(ctx.dialog).toHaveBeenCalledWith(
            expect.objectContaining({ title: 'Confirm permanent deletion' })
        );
        expect(item.delete).toHaveBeenCalled();
        expect(ctx.notify).toHaveBeenCalled();
        expect(ctx.refresh).toHaveBeenCalled();
    });

    it('uses trash title when softDeletes is true', async () => {
        const ModelClass = makeModelClass(true);
        const item = makeItem();
        const ctx = makeCtx();
        await instanceActionHandlers.delete(ModelClass)({ ...ctx, item } as any);
        expect(ctx.dialog).toHaveBeenCalledWith(
            expect.objectContaining({ title: 'Confirm send to trash' })
        );
    });

    it('does not delete when dialog is cancelled', async () => {
        const ModelClass = makeModelClass(false);
        const item = makeItem();
        const ctx = makeCtx({ dialog: vi.fn().mockResolvedValue(false) });
        await instanceActionHandlers.delete(ModelClass)({ ...ctx, item } as any);
        expect(item.delete).not.toHaveBeenCalled();
    });

    it('calls notify with error when delete throws', async () => {
        const ModelClass = makeModelClass(false);
        const item = makeItem();
        item.delete = vi.fn().mockRejectedValue(new Error('fail'));
        const ctx = makeCtx();
        await instanceActionHandlers.delete(ModelClass)({ ...ctx, item } as any);
        expect(ctx.notify).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
    });
});

describe('instanceActionHandlers.restore', () => {
    it('restores the item when confirmed', async () => {
        const ModelClass = makeModelClass(true);
        const item = makeItem();
        const ctx = makeCtx();
        await instanceActionHandlers.restore(ModelClass)({ ...ctx, item } as any);
        expect(item.restore).toHaveBeenCalled();
        expect(ctx.notify).toHaveBeenCalled();
        expect(ctx.refresh).toHaveBeenCalled();
    });

    it('does not restore when dialog is cancelled', async () => {
        const ModelClass = makeModelClass(true);
        const item = makeItem();
        const ctx = makeCtx({ dialog: vi.fn().mockResolvedValue(false) });
        await instanceActionHandlers.restore(ModelClass)({ ...ctx, item } as any);
        expect(item.restore).not.toHaveBeenCalled();
    });

    it('calls notify with error when restore throws', async () => {
        const ModelClass = makeModelClass(true);
        const item = makeItem();
        item.restore = vi.fn().mockRejectedValue(new Error('fail'));
        const ctx = makeCtx();
        await instanceActionHandlers.restore(ModelClass)({ ...ctx, item } as any);
        expect(ctx.notify).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
    });
});

describe('instanceActionHandlers.forceDelete', () => {
    it('permanently deletes the item when confirmed', async () => {
        const ModelClass = makeModelClass(true);
        const item = makeItem();
        const ctx = makeCtx();
        await instanceActionHandlers.forceDelete(ModelClass)({ ...ctx, item } as any);
        expect(item.forceDelete).toHaveBeenCalled();
        expect(ctx.notify).toHaveBeenCalled();
        expect(ctx.refresh).toHaveBeenCalled();
    });

    it('does not forceDelete when dialog is cancelled', async () => {
        const ModelClass = makeModelClass(true);
        const item = makeItem();
        const ctx = makeCtx({ dialog: vi.fn().mockResolvedValue(false) });
        await instanceActionHandlers.forceDelete(ModelClass)({ ...ctx, item } as any);
        expect(item.forceDelete).not.toHaveBeenCalled();
    });

    it('calls notify with error when forceDelete throws', async () => {
        const ModelClass = makeModelClass(true);
        const item = makeItem();
        item.forceDelete = vi.fn().mockRejectedValue(new Error('fail'));
        const ctx = makeCtx();
        await instanceActionHandlers.forceDelete(ModelClass)({ ...ctx, item } as any);
        expect(ctx.notify).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
    });
});

describe('staticActionHandlers.create', () => {
    it('navigates to the creation route', () => {
        const ModelClass = { plural: () => 'Items', getSchema: () => ({}) } as any;
        const navigate = vi.fn();
        staticActionHandlers.create(ModelClass)({ navigate } as any);
        expect(navigate).toHaveBeenCalledWith(expect.stringContaining('items'));
    });
});
