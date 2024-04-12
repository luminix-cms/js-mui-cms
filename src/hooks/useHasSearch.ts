import React from 'react';

import LayoutContext from '../contexts/LayoutContext';

/**
 * 
 * Gets whether the search bar is visible.
 * 
 * @returns {boolean} Whether the search bar is visible.
 */
export default function useHasSearch() {
    const { showSearch } = React.useContext(LayoutContext);
    
    return showSearch;
}

