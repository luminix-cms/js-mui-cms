import React from 'react';

import MuiDrawer, { DrawerProps } from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';

import useIsDesktopMode from '../../hooks/useIsDesktopMode';
import useLayoutConfig from '../../hooks/useLayoutConfig';
import useMenu from '../../hooks/useMenu';

import { StyledDrawerProps } from '../../types/PropTypes';

import { app } from '@luminix/core';

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
                    items={[
                        {
                            text: 'Item 1',
                            key: 1
                        },
                        {
                            text: 'Item 2',
                            key: 2,
                            children: [
                                {
                                    text: 'Item 2.1',
                                    key: 21
                                },
                                {
                                    text: 'Item 2.2',
                                    key: 22,
                                    children: [
                                        {
                                            text: 'Item 2.2.1',
                                            key: 221
                                        },
                                        {
                                            text: 'Item 2.2.2',
                                            key: 222
                                        }
                                    ]
                                
                                }
                            ],
                        }
                    ]}
                    onClick={() => !isDesktop && handleDrawerClose()}
                />
            </Box>

        </DrawerComponent>
    )
};

export default Drawer;

