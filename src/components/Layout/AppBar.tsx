import React from 'react';
import { app, config } from '@luminix/core';

import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/material/styles';

import { AppBarProps, StyledAppBarProps } from '../../types/PropTypes';

import useMenu from '../../hooks/useMenu';
import useLayoutConfig from '../../hooks/useLayoutConfig';
import useIsDesktopMode from '../../hooks/useIsDesktopMode';
import usePageTitle from '../../hooks/usePageTitle';
import useHasSearch from '../../hooks/useHasSearch';


const DesktopAppBar = styled(
    MuiAppBar,
    { shouldForwardProp: (prop) => !['open', 'drawerWidth', 'height'].includes(String(prop)) },
)<StyledAppBarProps>(({ theme, open, drawerWidth, height }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    height,
    ...open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
}));

const MobileAppBar = styled(
    MuiAppBar,
    { shouldForwardProp: (prop) => !['open', 'drawerWidth', 'height'].includes(String(prop)) },
)<StyledAppBarProps>(({ height }) => ({ height }));


const AppBar: React.FunctionComponent<AppBarProps> = ({ slots = {}, ...props }) => {

    const isDesktop = useIsDesktopMode();

    const AppBarComponent = isDesktop
        ? DesktopAppBar
        : MobileAppBar;

    const { 
        ['Layout.AppBar.MenuButton']: MenuButton,
        ['Layout.SearchBar']: SearchBar,
    } = app('cms').getComponents();

    const { open } = useMenu();

    const searching = useHasSearch();

    const height = useLayoutConfig('appBar.height') as number;
    const drawerWidth = useLayoutConfig('drawer.width', 280) as number;


    const {
        start = null,//: title = config('app.name', document.title),
        end = null,
    } = slots;

    const title = usePageTitle();

    return (
        <AppBarComponent
            open={open}
            height={height}
            drawerWidth={drawerWidth}
            {...props}
        >
            <Toolbar>
                {(!isDesktop || !open) && <MenuButton />}
                {!isDesktop ? start : null}
                <Typography
                    width="100%"
                    variant="h6"
                    noWrap
                    component="div"
                >
                    {(!isDesktop && title) || config('app.name', document.title)}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: 'flex' }}>
                    {searching && <SearchBar />}
                    {end}
                </Box>
            </Toolbar>
        </AppBarComponent>
    );

};

export default AppBar;




