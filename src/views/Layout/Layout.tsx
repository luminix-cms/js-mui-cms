import React from 'react';

import Avatar from '@mui/material/Avatar';
import Box, { BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MuiDrawer, { DrawerProps as MuiDrawerProps } from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';

import { CSSObject, Theme, styled, useTheme } from '@mui/material/styles';
import { app } from '@luminix/core';
import useMenu from '../../hooks/useMenu';
import useIsDesktopMode from '../../hooks/useIsDesktopMode';






const Layout: React.FunctionComponent = ({ children }) => {

    const {
        ['Layout.AppBar']: AppBar
    } = app('cms.component').make();

    

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
            />
            {children}
        </Box>
    )
};

export default Layout;

