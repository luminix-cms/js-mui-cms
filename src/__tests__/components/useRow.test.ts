import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import ModelFilterContext from '../../contexts/ModelFilterContext';
import useRow from '../../components/ModelIndex/Filter/useRow';
import { FilteredColumn } from '../../types/Filter';

const mockFilterFacade = {
    getFilterableColumns: vi.fn(() => [
        { key: 'name', label: 'Name', type: 'text', nullable: false, is_relation: false },
        { key: 'age', label: 'Age', type: 'integer', nullable: true, is_relation: false },
        { key: 'category', label: 'Category', type: 'text', nullable: false, is_relation: true },
    ]),
    getMatchingOperators: vi.fn(() => [{ key: 'equals', label: '=' }]),
    getInputType: vi.fn((type: string) => {
        if (type === 'integer') return 'number';
        return 'text';
    }),
};

vi.mock('@luminix/core', () => ({
    app: vi.fn(() => mockFilterFacade),
}));

const initialColumn: FilteredColumn = {
    key: 'name',
    operator: 'equals',
    type: 'text',
    value: '',
    nullable: false,
    is_relation: false,
};

function makeWrapper(setColumnsFilter: ReturnType<typeof vi.fn>) {
    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(ModelFilterContext.Provider, {
            value: {
                Model: null as never,
                anchorEl: null,
                setAnchorEl: vi.fn(),
                columnsFilter: [initialColumn],
                setColumnsFilter,
                searchParams: new URLSearchParams(),
                setSearchParams: vi.fn(),
                handleApplyFilters: vi.fn(),
                clearSearchParams: vi.fn(),
                clearFilters: vi.fn(),
            },
        }, children);
}

describe('useRow', () => {
    it('initializes with the column values provided', () => {
        const { result } = renderHook(() => useRow(0, initialColumn), {
            wrapper: makeWrapper(vi.fn()),
        });
        expect(result.current.key).toBe('name');
        expect(result.current.operator).toBe('equals');
        expect(result.current.type).toBe('text');
        expect(result.current.value).toBe('');
    });

    it('handleKey updates key and operator when a column is selected', async () => {
        const { result } = renderHook(() => useRow(0, initialColumn), {
            wrapper: makeWrapper(vi.fn()),
        });
        await act(async () => {
            await result.current.handleKey({ target: { value: 'age' } } as never);
        });
        expect(result.current.key).toBe('age');
        expect(result.current.operator).toBe('equals');
    });

    it('handleKey sets type to the new column type', async () => {
        const { result } = renderHook(() => useRow(0, initialColumn), {
            wrapper: makeWrapper(vi.fn()),
        });
        await act(async () => {
            await result.current.handleKey({ target: { value: 'age' } } as never);
        });
        expect(result.current.type).toBe('integer');
    });

    it('handleKey sets isRelation and nullable from column definition', async () => {
        const { result } = renderHook(() => useRow(0, initialColumn), {
            wrapper: makeWrapper(vi.fn()),
        });
        await act(async () => {
            await result.current.handleKey({ target: { value: 'category' } } as never);
        });
        expect(result.current.isRelation).toBe(true);
        expect(result.current.nullable).toBe(false);
    });

    it('handleOperator converts value to array for between operator', async () => {
        const columnWithValue = { ...initialColumn, value: 'hello' };
        const { result } = renderHook(() => useRow(0, columnWithValue), {
            wrapper: makeWrapper(vi.fn()),
        });
        await act(async () => {
            await result.current.handleOperator({ target: { value: 'between' } } as never);
        });
        expect(Array.isArray(result.current.value)).toBe(true);
    });

    it('handleOperator converts array value back to single value for equals operator', async () => {
        const columnWithArray = { ...initialColumn, operator: 'between', value: ['a', 'b'] };
        const { result } = renderHook(() => useRow(0, columnWithArray), {
            wrapper: makeWrapper(vi.fn()),
        });
        await act(async () => {
            await result.current.handleOperator({ target: { value: 'equals' } } as never);
        });
        expect(Array.isArray(result.current.value)).toBe(false);
    });

    it('handleRemoveColumn calls setColumnsFilter to remove the row at the given index', () => {
        const setColumnsFilter = vi.fn();
        const { result } = renderHook(() => useRow(0, initialColumn), {
            wrapper: makeWrapper(setColumnsFilter),
        });
        act(() => {
            result.current.handleRemoveColumn(0)();
        });
        const updater = setColumnsFilter.mock.calls.at(-1)![0];
        const result2 = updater([initialColumn, { ...initialColumn, key: 'email' }]);
        expect(result2).toHaveLength(1);
        expect(result2[0].key).toBe('email');
    });

    it('useEffect syncs local state back to columnsFilter in context', () => {
        const setColumnsFilter = vi.fn();
        renderHook(() => useRow(0, initialColumn), {
            wrapper: makeWrapper(setColumnsFilter),
        });
        expect(setColumnsFilter).toHaveBeenCalled();
        const updater = setColumnsFilter.mock.calls[0][0];
        const updated = updater([{ ...initialColumn, key: 'other' }]);
        expect(updated[0].key).toBe('name');
    });
});
