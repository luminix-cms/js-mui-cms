import React from 'react';
import { app, config } from '@luminix/core';

import Box from '@mui/material/Box';

import { styled } from '@mui/material/styles';

import { LayoutProps } from '../../types/PropTypes';
import useLayoutConfig from '../../hooks/useLayoutConfig';


const AppBarDisplacement = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Layout: React.FunctionComponent<LayoutProps> = ({ children, slotProps, ...props }) => {

    const {
        ['Layout.AppBar']: AppBar,
        ['Layout.Drawer']: Drawer,
    } = app('cms').getComponents();

    const height = useLayoutConfig('appBar.height') as number;

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
                <AppBarDisplacement style={{ height }} />
                {children}
            </Box>
        </Box>
    )
};

export default Layout;

