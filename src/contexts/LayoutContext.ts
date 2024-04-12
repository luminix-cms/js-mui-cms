import React from 'react';
import { LayoutContextValue } from '../types/Contexts';

const DEFAULT_VALUE: LayoutContextValue = {
    open: false,
    setOpen: () => {},
    layout: {},
    isBreakpointUp: false,
    currentPage: '',
    setCurrentPage: () => {},
    showSearch: false,
    setShowSearch: () => {},
};

const LayoutContext = React.createContext(DEFAULT_VALUE);

export default LayoutContext;