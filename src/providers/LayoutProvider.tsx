import React from 'react';
import { useConfig } from '@luminix/react';

import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';

import { LayoutProviderValue } from '../types/Provider';
import { CmsConfig } from '../types/Config';
import { config } from '@luminix/core';

const DEFAULT_VALUE: LayoutProviderValue = {
    open: false,
    setOpen: () => {},
    layout: {},
    isBreakpointUp: false,
    currentPage: '',
    setCurrentPage: () => {},
    showSearch: false,
    setShowSearch: () => {},
};

export const LayoutContext = React.createContext(DEFAULT_VALUE); // exporta o context pra usar onde precisar

const originalTitle = document.title;

const LayoutProvider: React.FunctionComponent = ({ children }) => {
     
    const [open, setOpen] = React.useState(DEFAULT_VALUE.open);
    const [currentPage, setCurrentPage] = React.useState('');
    const [showSearch, setShowSearch] = React.useState(false);

    const layout = useConfig('luminix.cms.layout', {}) as CmsConfig['layout'];

    const isBreakpointUp = useMediaQuery((theme: Theme) => theme.breakpoints.up(layout?.breakpoint || 'md'));

    const value: LayoutProviderValue = {
        open, setOpen, layout, isBreakpointUp,
        currentPage, setCurrentPage, showSearch,
        setShowSearch,
    };

    React.useEffect(() => {
        document.title = currentPage
            ? `${currentPage} | ${config('app.name', originalTitle)}`
            : config('app.name', originalTitle) as string;

        return () => {
            document.title = originalTitle;
        };
    }, [currentPage]);

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    );
};

// usa o provider como export default
export default LayoutProvider;