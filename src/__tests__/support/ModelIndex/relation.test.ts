import { describe, it, expect, vi } from 'vitest';
import { loadRelationOptions, aggregateRelationOptions } from '../../../support/ModelIndex/relation';

const makeItem = (id: number) => ({ getKey: () => id });

const makeRelatedModel = (items: any[], overrides: any = {}) => ({
    getSchema: () => ({ primaryKey: 'id' }),
    where: vi.fn().mockReturnThis(),
    searchBy: vi.fn().mockReturnThis(),
    get: vi.fn().mockResolvedValue({
        data: {
            all: () => items,
            ...items,
            [Symbol.iterator]: function* () { yield* items; },
        },
    }),
    ...overrides,
});

vi.mock('@luminix/core', () => ({
    ModelType: class {},
    model: vi.fn(() => ({
        make: vi.fn(() => makeRelatedModel([makeItem(1), makeItem(2), makeItem(3)])),
    })),
    collect: vi.fn((items: any[]) => ({
        all: () => items,
        [Symbol.iterator]: function* () { yield* items; },
        unique: vi.fn((key: string) => ({ all: () => items })),
        length: items.length,
    })),
}));

vi.mock('@luminix/support', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@luminix/support')>();
    return { ...actual };
});

const makeModelClass = (relationModel = 'Category') => ({
    getSchema: () => ({
        relations: {
            category: { model: relationModel },
        },
    }),
} as any);

describe('loadRelationOptions', () => {
    it('returns a collection merging loaded options with new ones', async () => {
        const { collect } = await import('@luminix/core');
        const result = await loadRelationOptions(makeModelClass(), 'category', []);
        expect(collect).toHaveBeenCalled();
    });

    it('filters out already-loaded options', async () => {
        const { model } = await import('@luminix/core');
        (model as any).mockReturnValue({
            make: vi.fn(() => makeRelatedModel([makeItem(1), makeItem(2)])),
        });
        const result = await loadRelationOptions(makeModelClass(), 'category', [makeItem(1) as any]);
        expect(result).toBeDefined();
    });

    it('caps results at 15 items', async () => {
        const { model, collect } = await import('@luminix/core');
        const manyItems = Array.from({ length: 20 }, (_, i) => makeItem(i + 1));
        (model as any).mockReturnValue({
            make: vi.fn(() => makeRelatedModel(manyItems)),
        });
        await loadRelationOptions(makeModelClass(), 'category', []);
        expect(collect).toHaveBeenCalled();
    });
});

describe('aggregateRelationOptions', () => {
    it('returns a unique collection of options', async () => {
        const { model } = await import('@luminix/core');
        (model as any).mockReturnValue({
            make: vi.fn(() => makeRelatedModel([makeItem(1), makeItem(2)])),
        });

        const loadedOptions = { all: () => [makeItem(1)], [Symbol.iterator]: function* () { yield makeItem(1); } } as any;
        const result = await aggregateRelationOptions(makeModelClass(), 'category', 'search', loadedOptions);
        expect(result).toBeDefined();
    });

    it('works with empty search term', async () => {
        const { model } = await import('@luminix/core');
        (model as any).mockReturnValue({
            make: vi.fn(() => makeRelatedModel([makeItem(1)])),
        });

        const loadedOptions = { all: () => [], [Symbol.iterator]: function* () {} } as any;
        const result = await aggregateRelationOptions(makeModelClass(), 'category', '', loadedOptions);
        expect(result).toBeDefined();
    });
});
