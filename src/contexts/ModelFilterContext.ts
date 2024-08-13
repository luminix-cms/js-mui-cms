
import React from 'react';

import { Model } from '@luminix/core';

import { ModelFilterContextValue } from '../types/Contexts';

const ModelFilterContext = React.createContext<ModelFilterContextValue>({
    Model: null as unknown as typeof Model,
    anchorEl: null,
    setAnchorEl: () => {},
    columnsFilter: [],
    setColumnsFilter: () => {},
    searchParams: new URLSearchParams(), 
    setSearchParams: () => {},
    clearSearchParams: () => {},
    clearFilters: () => {},
});

export default ModelFilterContext;