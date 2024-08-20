import React from 'react';
import { app } from '@luminix/core';

import { DrawerProps } from '@mui/material/Drawer';

import {
    Drawer as MuiDrawer,
    IconButton,
    Divider,
    Box,
} from '@mui/material';

import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon
} from '@mui/icons-material';

import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';

import useIsDesktopMode from '../../hooks/useIsDesktopMode';
import useLayoutConfig from '../../hooks/useLayoutConfig';
import useMenu from '../../hooks/useMenu';

import { StyledDrawerProps } from '../../types/PropTypes';


const openedMixin = (theme: Theme, width: number): CSSObject => ({
    width,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(9)} + 1px)`,
    [theme.breakpoints.up('sm')]: { width: `calc(${theme.spacing(10)} + 1px)` },
});

const DesktopDrawer = styled(
    MuiDrawer,
    { shouldForwardProp: (prop) => !['open', 'width'].includes(String(prop)) },
)<StyledDrawerProps>(({ theme, open, width }) => ({
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...open && {
        ...openedMixin(theme, width),
        '& .MuiDrawer-paper': openedMixin(theme, width),
    },
    ...!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    },
}));

const MobileDrawer = styled(
    MuiDrawer,
    { shouldForwardProp: (prop) => prop !== 'width' },
)(() => ({}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));


const Drawer: React.FunctionComponent<DrawerProps> = (props) => {

    const theme = useTheme();

    const isDesktop = useIsDesktopMode();

    const { open, handleDrawerClose } = useMenu();

    const DrawerComponent = isDesktop
        ? DesktopDrawer
        : MobileDrawer;

    const width = useLayoutConfig('drawer.width', 280) as number;
    const appBarHeight = useLayoutConfig('appBar.height') as number;

    const RecursiveList = app('cms').getComponent('RecursiveList');

    const menuItems = app('cms').getMenuItems();

    return (
        <DrawerComponent
            variant={isDesktop ? 'permanent' : 'temporary'}
            open={open}
            width={width}
            onClose={handleDrawerClose}
            PaperProps={{ sx: { width } }}
            sx={{
                display: 'flex',
                direction: 'flex-column',
                flexWrap: 'nowrap',
                height: '100%',
            }}
            {...props}
        >
            <DrawerHeader style={{ height: appBarHeight }}>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />

            <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                <RecursiveList 
                    collapsed={!open && isDesktop}
                    items={menuItems}
                    onClick={() => !isDesktop && handleDrawerClose()}
                />
            </Box>

        </DrawerComponent>
    )
};

export default Drawer;

