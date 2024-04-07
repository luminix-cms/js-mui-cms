import React from 'react';
import useIsDesktopMode from '../../hooks/useIsDesktopMode';

import MuiDrawer, { DrawerProps } from '@mui/material/Drawer';

import { styled, Theme, CSSObject } from '@mui/material/styles';

import useLayoutConfig from '../../hooks/useLayoutConfig';
import { StyledDrawerProps } from '../../types/PropTypes';
import useMenu from '../../hooks/useMenu';

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


const Drawer: React.FunctionComponent<DrawerProps> = (props) => {

    const isDesktop = useIsDesktopMode();

    const { open, handleDrawerClose } = useMenu();

    const DrawerComponent = isDesktop
        ? DesktopDrawer
        : MobileDrawer;

    const width = useLayoutConfig('drawer.width', 280) as number;

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
            Drawer
        </DrawerComponent>
    )
};

export default Drawer;

