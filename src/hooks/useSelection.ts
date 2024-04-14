import React from 'react';
import { Model } from '@luminix/core';
import { useCollection } from '@luminix/react';

import TableContext from '../contexts/TableContext';

export default function useSelection() {

    const {
        selected: selectedContext,
        items,
    } = React.useContext(TableContext);

    const selected = useCollection(selectedContext);

    const handleClearSelected = () => {
        selectedContext.splice(0, selectedContext.count());
    };

    const handleSelectToggle = (item: Model) => {
        const index = selectedContext.search(item);
        if (index !== false) {
            selectedContext.pull(index);
            return;
        }
        selectedContext.push(item);
    };

    const handleSelectToggleAll = () => {
        if (!items) {
            return;
        }
        if (selectedContext.count() === items.count()) {
            handleClearSelected();
            return;
        }
        selectedContext.splice(0, selectedContext.count(), ...items);
    };

    const indeterminate = items ? (selected.count() > 0 && selected.count() < items.count()) : false;
    const allSelected = items ? selected.count() === items.count() : false;
    

    return {
        selected,
        indeterminate,
        allSelected,
        handleClearSelected,
        handleSelectToggle,
        handleSelectToggleAll,
    }
}