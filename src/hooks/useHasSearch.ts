import React from 'react';

import { LayoutContext } from '../providers/LayoutProvider';

export default function useHasSearch() {
    const { showSearch } = React.useContext(LayoutContext);
    
    return showSearch;
}

