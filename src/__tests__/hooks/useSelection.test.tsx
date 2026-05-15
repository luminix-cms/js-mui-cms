import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { Collection } from '@luminix/support';
import TableContext from '../../contexts/TableContext';
import useSelection from '../../hooks/useSelection';

vi.mock('@luminix/core', () => ({
    ModelType: class ModelType {},
    collect: (items: unknown[]) => new Collection(items),
}));

vi.mock('@luminix/react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@luminix/react')>();
    return {
        ...actual,
        useCollection: (col: Collection<unknown>) => {
            const [snapshot, setSnapshot] = React.useState(() => col.collect());
            React.useEffect(() => {
                return col.on('change', ({ items }) => {
                    setSnapshot(new Collection(items));
                });
            }, [col]);
            return snapshot;
        },
    };
});

type Item = { id: number };

function makeContext(items: Item[]) {
    const selectedCollection = new Collection<Item>([]);
    const itemsCollection = new Collection<Item>(items);
    return { selectedCollection, itemsCollection };
}

function makeWrapper(selected: Collection<Item>, items: Collection<Item>) {
    return ({ children }: { children: React.ReactNode }) => (
        <TableContext.Provider value={{
            selected: selected as never,
            items: items as never,
            columns: [],
            columnCount: 0,
            massActions: [],
            error: new Error(),
            Model: null as never,
        }}>
            {children}
        </TableContext.Provider>
    );
}

describe('useSelection', () => {
    it('starts with empty selection and allSelected false', () => {
        const { selectedCollection, itemsCollection } = makeContext([{ id: 1 }, { id: 2 }]);
        const { result } = renderHook(() => useSelection(), {
            wrapper: makeWrapper(selectedCollection, itemsCollection),
        });
        expect(result.current.allSelected).toBe(false);
        expect(result.current.indeterminate).toBe(false);
    });

    it('handleSelectToggle adds an item to the selection', () => {
        const item = { id: 1 };
        const { selectedCollection, itemsCollection } = makeContext([item, { id: 2 }]);
        const { result } = renderHook(() => useSelection(), {
            wrapper: makeWrapper(selectedCollection, itemsCollection),
        });
        act(() => {
            result.current.handleSelectToggle(item as never);
        });
        expect(result.current.isSelected(item as never)).toBe(true);
    });

    it('handleSelectToggle removes an already-selected item (toggle off)', () => {
        const item = { id: 1 };
        const { selectedCollection, itemsCollection } = makeContext([item, { id: 2 }]);
        const { result } = renderHook(() => useSelection(), {
            wrapper: makeWrapper(selectedCollection, itemsCollection),
        });
        act(() => {
            result.current.handleSelectToggle(item as never);
        });
        act(() => {
            result.current.handleSelectToggle(item as never);
        });
        expect(result.current.isSelected(item as never)).toBe(false);
    });

    it('handleClearSelected empties the selection', () => {
        const item = { id: 1 };
        const { selectedCollection, itemsCollection } = makeContext([item]);
        const { result } = renderHook(() => useSelection(), {
            wrapper: makeWrapper(selectedCollection, itemsCollection),
        });
        act(() => {
            result.current.handleSelectToggle(item as never);
        });
        act(() => {
            result.current.handleClearSelected();
        });
        expect(result.current.isSelected(item as never)).toBe(false);
        expect(result.current.allSelected).toBe(false);
    });

    it('indeterminate is true when selection is partial', () => {
        const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const { selectedCollection, itemsCollection } = makeContext(items);
        const { result } = renderHook(() => useSelection(), {
            wrapper: makeWrapper(selectedCollection, itemsCollection),
        });
        act(() => {
            result.current.handleSelectToggle(items[0] as never);
        });
        expect(result.current.indeterminate).toBe(true);
        expect(result.current.allSelected).toBe(false);
    });

    it('allSelected is true when every item is selected', () => {
        const items = [{ id: 1 }, { id: 2 }];
        const { selectedCollection, itemsCollection } = makeContext(items);
        const { result } = renderHook(() => useSelection(), {
            wrapper: makeWrapper(selectedCollection, itemsCollection),
        });
        act(() => {
            result.current.handleSelectToggleAll();
        });
        expect(result.current.allSelected).toBe(true);
        expect(result.current.indeterminate).toBe(false);
    });

    it('handleSelectToggleAll clears selection when all items are already selected', () => {
        const items = [{ id: 1 }, { id: 2 }];
        const { selectedCollection, itemsCollection } = makeContext(items);
        const { result } = renderHook(() => useSelection(), {
            wrapper: makeWrapper(selectedCollection, itemsCollection),
        });
        act(() => {
            result.current.handleSelectToggleAll();
        });
        act(() => {
            result.current.handleSelectToggleAll();
        });
        expect(result.current.allSelected).toBe(false);
    });

    it('isSelected returns false for unselected items', () => {
        const item = { id: 1 };
        const { selectedCollection, itemsCollection } = makeContext([item, { id: 2 }]);
        const { result } = renderHook(() => useSelection(), {
            wrapper: makeWrapper(selectedCollection, itemsCollection),
        });
        expect(result.current.isSelected(item as never)).toBe(false);
    });
});
