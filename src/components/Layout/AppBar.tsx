import React from 'react';
import { app, config } from '@luminix/core';

import {
    Avatar,
    Box,
    AppBar as MuiAppBar,
    Toolbar,
    Typography,
    useMediaQuery,
} from '@mui/material';

import { styled } from '@mui/material/styles';

import { AppBarProps, StyledAppBarProps } from '../../types/PropTypes';

import useMenu from '../../hooks/useMenu';
import useLayoutConfig from '../../hooks/useLayoutConfig';
import useIsDesktopMode from '../../hooks/useIsDesktopMode';
import usePageTitle from '../../hooks/usePageTitle';
import useHasSearch from '../../hooks/useHasSearch';

import logo from '../../assets/luminix-40x40.png';
import whiteLogo from '../../assets/luminix-white-40x40.png';
import useHasBackButton from '../../hooks/useHasBackButton';

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

    const prefersDarkTheme = useMediaQuery('(prefers-color-scheme: dark)');

    const AppBarComponent = isDesktop
        ? DesktopAppBar
        : MobileAppBar;

    const { 
        ['Layout.AppBar.MenuButton']: MenuButton,
        ['Layout.SearchBar']: SearchBar,
        ['Layout.BackButton']: BackButton,
    } = app('cms').getComponents();

    const { open } = useMenu();

    const searching = useHasSearch();
    const hasBackButton = useHasBackButton();

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
                {((isDesktop && !open) || (!isDesktop && !hasBackButton)) && <MenuButton />}
                {!isDesktop && hasBackButton && <BackButton />}
                {!isDesktop ? start : null}
                <Typography
                    width="100%"
                    variant="h6"
                    noWrap
                    component="div"
                >
                    {(!isDesktop && title) || config('app.name', document.title) as string}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Box 
                    display="flex"
                    alignItems="center"
                >
                    {searching && <SearchBar />}
                    {end || (
                        <Avatar
                            src={prefersDarkTheme ? logo : whiteLogo}
                            alt="Luminix"
                            variant="square"
                            sx={{
                                width: 40,
                                height: 40,
                                marginLeft: searching 
                                    ? 2
                                    : 0,
                            }}
                        />
                    )}
                </Box>
            </Toolbar>
        </AppBarComponent>
    );

};

export default AppBar;




