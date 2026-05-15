import { describe, it, expect, vi } from 'vitest';
import { changeValueFromArray, changeValueToArray, mountRelationModelOption } from '../../../../support/ModelIndex/Filter/inputs';

vi.mock('@luminix/core', () => ({
    model: vi.fn(() => ({
        make: vi.fn((modelName: string) => ({
            getSchema: () => ({ primaryKey: 'id' }),
            where: vi.fn(() => ({
                first: vi.fn().mockResolvedValue({ id: 1, name: 'Item 1' }),
            })),
        })),
    })),
    ModelType: class {},
}));

describe('changeValueFromArray', () => {
    it('returns input as-is when it is not an array', () => {
        expect(changeValueFromArray('hello')).toBe('hello');
        expect(changeValueFromArray(42)).toBe(42);
        expect(changeValueFromArray(null)).toBe(null);
    });

    it('returns empty string for empty array', () => {
        expect(changeValueFromArray([])).toBe('');
    });

    it('returns first element for non-empty array', () => {
        expect(changeValueFromArray(['foo', 'bar'])).toBe('foo');
        expect(changeValueFromArray([10, 20])).toBe(10);
    });
});

describe('changeValueToArray', () => {
    it('returns array as-is when input is already an array', () => {
        const arr = [1, 2];
        expect(changeValueToArray(arr)).toBe(arr);
    });

    it('returns empty array for empty/null-ish input', () => {
        expect(changeValueToArray('')).toEqual([]);
        expect(changeValueToArray(null)).toEqual([]);
    });

    it('wraps a non-empty string in a two-element array', () => {
        expect(changeValueToArray('foo')).toEqual(['foo', '']);
    });
});

describe('mountRelationModelOption', () => {
    it('fetches items for each id in the input array', async () => {
        const ModelClass = {
            getSchema: () => ({
                relations: {
                    category: { model: 'Category' },
                },
            }),
        } as any;

        const result = await mountRelationModelOption(ModelClass, 'category', [1, 2] as any);
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
    });

    it('returns an empty array for empty input', async () => {
        const ModelClass = {
            getSchema: () => ({
                relations: {
                    category: { model: 'Category' },
                },
            }),
        } as any;

        const result = await mountRelationModelOption(ModelClass, 'category', [] as any);
        expect(result).toEqual([]);
    });
});
