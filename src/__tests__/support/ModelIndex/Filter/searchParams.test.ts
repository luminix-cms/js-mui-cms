import { describe, it, expect, vi } from 'vitest';
import { translateColumnsFromQuery, translateColumnsToQuery } from '../../../../support/ModelIndex/Filter/searchParams';
import type { FilterColumn, FilteredColumn } from '../../../../types/Filter';

vi.mock('@luminix/core', () => ({
    app: vi.fn(() => ({
        getInputType: vi.fn((type: string) => {
            switch (type) {
                case 'datetime': return 'datetime-local';
                case 'boolean': return 'boolean';
                default: return 'text';
            }
        }),
    })),
}));

const textColumn: FilterColumn = { key: 'name', label: 'Name', type: 'text', nullable: true, is_relation: false };
const relColumn: FilterColumn = { key: 'category', label: 'Category', type: 'autocomplete', nullable: false, is_relation: true };
const boolColumn: FilterColumn = { key: 'active', label: 'Active', type: 'boolean', nullable: false, is_relation: false };

function makeParams(entries: Record<string, string>): URLSearchParams {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(entries)) {
        p.set(k, v);
    }
    return p;
}

describe('translateColumnsFromQuery', () => {
    it('returns empty array when searchParams has no "where" key', () => {
        const params = makeParams({ sort: 'name' });
        const result = translateColumnsFromQuery([textColumn], params);
        expect(result).toEqual([]);
    });

    it('returns empty array when "where" is empty', () => {
        const params = new URLSearchParams();
        const result = translateColumnsFromQuery([textColumn], params);
        expect(result).toEqual([]);
    });

    it('returns a FilteredColumn for a simple equals filter', () => {
        const params = makeParams({ 'where[name]': 'John' });
        const result = translateColumnsFromQuery([textColumn], params);
        expect(result).toHaveLength(1);
        expect(result[0].key).toBe('name');
        expect(result[0].operator).toBe('equals');
        expect(result[0].value).toBe('John');
    });

    it('uses explicit operator from key suffix', () => {
        const params = makeParams({ 'where[name:contains]': 'Jo' });
        const result = translateColumnsFromQuery([textColumn], params);
        expect(result[0].operator).toBe('contains');
    });

    it('uses "relation" operator for a relation column with no explicit operator', () => {
        const params = makeParams({ 'where[category]': '5' });
        const result = translateColumnsFromQuery([relColumn], params);
        expect(result[0].operator).toBe('relation');
    });

    it('skips entries that do not match any column', () => {
        const params = makeParams({ 'where[unknown]': 'val' });
        const result = translateColumnsFromQuery([textColumn], params);
        expect(result).toHaveLength(0);
    });

    it('converts boolean value to a number', () => {
        const params = makeParams({ 'where[active]': '1' });
        const result = translateColumnsFromQuery([boolColumn], params);
        expect(result[0].value).toBe(1);
    });
});

describe('translateColumnsToQuery', () => {
    it('returns empty URLSearchParams for empty columns array', () => {
        const result = translateColumnsToQuery([]);
        expect([...result.entries()]).toHaveLength(0);
    });

    it('sets a simple where param for equals operator (no colon suffix)', () => {
        const col: FilteredColumn = { key: 'name', operator: 'equals', type: 'text', value: 'John', nullable: true, is_relation: false };
        const result = translateColumnsToQuery([col]);
        expect(result.get('where[name]')).toBe('John');
    });

    it('includes the operator in the key for non-equals operators', () => {
        const col: FilteredColumn = { key: 'name', operator: 'contains', type: 'text', value: 'Jo', nullable: true, is_relation: false };
        const result = translateColumnsToQuery([col]);
        expect(result.get('where[name:contains]')).toBe('Jo');
    });

    it('sets indexed params for array values', () => {
        const col: FilteredColumn = { key: 'age', operator: 'between', type: 'int', value: ['5', '10'], nullable: false, is_relation: false };
        const result = translateColumnsToQuery([col]);
        expect(result.get('where[age:between][0]')).toBe('5');
        expect(result.get('where[age:between][1]')).toBe('10');
    });

    it('handles multiple columns', () => {
        const cols: FilteredColumn[] = [
            { key: 'name', operator: 'equals', type: 'text', value: 'Jane', nullable: true, is_relation: false },
            { key: 'active', operator: 'equals', type: 'text', value: '1', nullable: false, is_relation: false },
        ];
        const result = translateColumnsToQuery(cols);
        expect(result.get('where[name]')).toBe('Jane');
        expect(result.get('where[active]')).toBe('1');
    });
});
