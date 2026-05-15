import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FilterService } from '../../services/FilterService';
import type { FilterColumn, FilteredColumn } from '../../types/Filter';

vi.mock('@luminix/core', () => ({
    config: vi.fn((key: string) => {
        if (key === 'luminix.admin.filter.operators') {
            return [
                'equals', 'notEquals',
                'greaterThan', 'greaterThanOrEquals',
                'lessThan', 'lessThanOrEquals',
                'between', 'notBetween',
                'like', 'contains', 'startsWith', 'endsWith',
                'null', 'notNull',
                'relation',
            ];
        }
        return undefined;
    }),
    ModelType: class {},
    model: vi.fn(),
}));

const makeColumn = (overrides: Partial<FilterColumn> = {}): FilterColumn => ({
    key: 'name',
    label: 'Name',
    type: 'string',
    nullable: true,
    is_relation: false,
    ...overrides,
});

let service: FilterService & { filterableColumns: any };

beforeEach(() => {
    service = new FilterService() as any;
    service.filterableColumns = (cols: FilterColumn[]) => cols;
});

describe('FilterService.getInputType', () => {
    it.each([
        ['int', 'number'],
        ['float', 'number'],
        ['number', 'number'],
        ['date', 'date'],
        ['datetime', 'datetime-local'],
        ['timestamp', 'datetime-local'],
        ['autocomplete', 'autocomplete'],
        ['bool', 'boolean'],
        ['boolean', 'boolean'],
        ['string', 'text'],
        ['text', 'text'],
        ['unknown', 'text'],
    ])('maps type "%s" to input type "%s"', (type, expected) => {
        expect(service.getInputType(type)).toBe(expected);
    });
});

describe('FilterService.getOperators', () => {
    it('returns an array of operator strings', () => {
        const operators = service.getOperators();
        expect(Array.isArray(operators)).toBe(true);
        expect(operators).toContain('equals');
        expect(operators).toContain('greaterThan');
    });
});

describe('FilterService.getMatchingOperators', () => {
    it('excludes "like" for all column types', () => {
        const col = makeColumn({ type: 'string', nullable: true, is_relation: false });
        const result = service.getMatchingOperators(col);
        expect(result.map((o) => o.key)).not.toContain('like');
    });

    it('excludes "relation" for non-relation columns', () => {
        const col = makeColumn({ is_relation: false });
        const result = service.getMatchingOperators(col);
        expect(result.map((o) => o.key)).not.toContain('relation');
    });

    it('includes "relation" for relation columns', () => {
        const col = makeColumn({ is_relation: true, type: 'autocomplete' });
        const result = service.getMatchingOperators(col);
        expect(result.map((o) => o.key)).toContain('relation');
    });

    it('excludes numeric operators for text type', () => {
        const col = makeColumn({ type: 'string' });
        const keys = service.getMatchingOperators(col).map((o) => o.key);
        expect(keys).not.toContain('greaterThan');
        expect(keys).not.toContain('between');
    });

    it('excludes text operators for number type', () => {
        const col = makeColumn({ type: 'int' });
        const keys = service.getMatchingOperators(col).map((o) => o.key);
        expect(keys).not.toContain('contains');
        expect(keys).not.toContain('startsWith');
        expect(keys).not.toContain('endsWith');
    });

    it('excludes text operators for date type', () => {
        const col = makeColumn({ type: 'date' });
        const keys = service.getMatchingOperators(col).map((o) => o.key);
        expect(keys).not.toContain('contains');
    });

    it('excludes null/notNull for non-nullable columns', () => {
        const col = makeColumn({ nullable: false });
        const keys = service.getMatchingOperators(col).map((o) => o.key);
        expect(keys).not.toContain('null');
        expect(keys).not.toContain('notNull');
    });

    it('includes null/notNull for nullable columns', () => {
        const col = makeColumn({ nullable: true });
        const keys = service.getMatchingOperators(col).map((o) => o.key);
        expect(keys).toContain('null');
        expect(keys).toContain('notNull');
    });

    it('maps operator labels for known operators', () => {
        const col = makeColumn({ type: 'int', nullable: false });
        const result = service.getMatchingOperators(col);
        const equalsOp = result.find((o) => o.key === 'equals');
        expect(equalsOp?.label).toBe('=');
        const gtOp = result.find((o) => o.key === 'greaterThan');
        expect(gtOp?.label).toBe('>');
    });
});

describe('FilterService.getFilterableColumns', () => {
    it('maps attributes to FilterColumn objects', () => {
        const ModelClass = {
            getSchema: () => ({
                attributes: [
                    { name: 'title', phpType: 'string', cast: null, hidden: false, appended: false, virtual: false, nullable: true },
                    { name: 'count', phpType: 'int', cast: 'int', hidden: false, appended: false, virtual: false, nullable: false },
                ],
                relations: {},
            }),
        } as any;
        const result = service.getFilterableColumns(ModelClass);
        expect(result).toHaveLength(2);
        expect(result[0].key).toBe('title');
        expect(result[1].type).toBe('int');
    });

    it('excludes hidden, appended, and virtual attributes', () => {
        const ModelClass = {
            getSchema: () => ({
                attributes: [
                    { name: 'visible', phpType: 'string', cast: null, hidden: false, appended: false, virtual: false, nullable: true },
                    { name: 'hidden_field', phpType: 'string', cast: null, hidden: true, appended: false, virtual: false, nullable: true },
                    { name: 'appended_field', phpType: 'string', cast: null, hidden: false, appended: true, virtual: false, nullable: true },
                    { name: 'virtual_field', phpType: 'string', cast: null, hidden: false, appended: false, virtual: true, nullable: true },
                ],
                relations: {},
            }),
        } as any;
        const result = service.getFilterableColumns(ModelClass);
        expect(result).toHaveLength(1);
        expect(result[0].key).toBe('visible');
    });

    it('includes relation columns as autocomplete type', () => {
        const ModelClass = {
            getSchema: () => ({
                attributes: [],
                relations: {
                    category: { model: 'Category' },
                },
            }),
        } as any;
        const result = service.getFilterableColumns(ModelClass);
        expect(result).toHaveLength(1);
        expect(result[0].is_relation).toBe(true);
        expect(result[0].type).toBe('autocomplete');
    });
});

describe('FilterService.checkIfCanApplyFilters', () => {
    it('returns true (no block) for empty filter array', () => {
        expect(service.checkIfCanApplyFilters([])).toBe(true);
    });

    it('returns true when a column key is not set', () => {
        const col: FilteredColumn = { key: '', operator: 'equals', type: 'string', value: 'val', nullable: true, is_relation: false };
        expect(service.checkIfCanApplyFilters([col])).toBe(true);
    });

    it('returns true when operator is not set', () => {
        const col: FilteredColumn = { key: 'name', operator: '', type: 'string', value: 'val', nullable: true, is_relation: false };
        expect(service.checkIfCanApplyFilters([col])).toBe(true);
    });

    it('returns true when value is not set for non-boolean type', () => {
        const col: FilteredColumn = { key: 'name', operator: 'equals', type: 'string', value: '', nullable: true, is_relation: false };
        expect(service.checkIfCanApplyFilters([col])).toBe(true);
    });

    it('returns false (can apply) when all columns are valid', () => {
        const col: FilteredColumn = { key: 'name', operator: 'equals', type: 'string', value: 'John', nullable: true, is_relation: false };
        expect(service.checkIfCanApplyFilters([col])).toBe(false);
    });

    it('returns true for between operator when first value is empty', () => {
        const col: FilteredColumn = { key: 'age', operator: 'between', type: 'int', value: ['', '10'], nullable: false, is_relation: false };
        expect(service.checkIfCanApplyFilters([col])).toBe(true);
    });

    it('returns true for between operator when second value is empty', () => {
        const col: FilteredColumn = { key: 'age', operator: 'between', type: 'int', value: ['5', ''], nullable: false, is_relation: false };
        expect(service.checkIfCanApplyFilters([col])).toBe(true);
    });

    it('returns false for between operator when both values are set', () => {
        const col: FilteredColumn = { key: 'age', operator: 'between', type: 'int', value: ['5', '10'], nullable: false, is_relation: false };
        expect(service.checkIfCanApplyFilters([col])).toBe(false);
    });

    it('returns true when boolean value is undefined', () => {
        const col: FilteredColumn = { key: 'active', operator: 'equals', type: 'boolean', value: undefined, nullable: false, is_relation: false };
        expect(service.checkIfCanApplyFilters([col])).toBe(true);
    });
});
