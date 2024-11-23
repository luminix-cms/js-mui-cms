import React from 'react';

import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';

import { LayoutContextValue } from '../../types/Contexts';
import { CmsConfig } from '../../types/Config';
import { config } from '@luminix/core';

import LayoutContext from '../../contexts/LayoutContext';

const originalTitle = document.title;

const LayoutProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
     
    const [open, setOpen] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState('');
    const [showSearch, setShowSearch] = React.useState(false);
    const [showBackButton, setShowBackButton] = React.useState(false);

    const layout = config('luminix.cms.layout', {}) as CmsConfig['layout'];

    const isBreakpointUp = useMediaQuery((theme: Theme) => theme.breakpoints.up(layout?.breakpoint || 'md'));

    const value: LayoutContextValue = {
        open, setOpen, layout, isBreakpointUp,
        currentPage, setCurrentPage, showSearch,
        setShowSearch, showBackButton, setShowBackButton
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

export default LayoutProvider;
