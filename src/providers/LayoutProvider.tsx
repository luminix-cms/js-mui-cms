import React from 'react';
import { useConfig } from '@luminix/react';

import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';

import { LayoutProviderValue } from '../types/Provider';
import { CmsConfig } from '../types/Config';

const DEFAULT_VALUE: LayoutProviderValue = {
    open: false,
    setOpen: () => {},
    layout: {},
    isBreakpointUp: false,
};

export const LayoutContext = React.createContext(DEFAULT_VALUE); // exporta o context pra usar onde precisar

const LayoutProvider: React.FunctionComponent = ({ children }) => {
     
    const [open, setOpen] = React.useState(DEFAULT_VALUE.open);

    const layout = useConfig('luminix.cms.layout', {}) as CmsConfig['layout'];

    const isBreakpointUp = useMediaQuery((theme: Theme) => theme.breakpoints.up(layout?.breakpoint || 'md'));

    const value: LayoutProviderValue = {
        open, setOpen, layout, isBreakpointUp,
    };

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    );
};

// usa o provider como export default
export default LayoutProvider;