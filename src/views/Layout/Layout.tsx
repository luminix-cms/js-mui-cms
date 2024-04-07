import React from 'react';

import Box from '@mui/material/Box';

import { app, config } from '@luminix/core';
import { LayoutProps } from '../../types/PropTypes';



const Layout: React.FunctionComponent<LayoutProps> = ({ children, slotProps, ...props }) => {

    const {
        ['Layout.AppBar']: AppBar,
        ['Layout.Drawer']: Drawer,
    } = app('cms.component').make();

    const {
        AppBar: appBarProps,
        Drawer: drawerProps,
        main: mainProps,
    } = slotProps || {};

    return (
        <Box sx={{ display: 'flex' }} {...props}>
            <AppBar
                position="fixed"
                title={config('app.name')}
                {...appBarProps}
            />
            <Drawer {...drawerProps} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 1, sm: 2, md: 3 },
                }}
                {...mainProps}
            >
                {children}
            </Box>
        </Box>
    )
};

export default Layout;

