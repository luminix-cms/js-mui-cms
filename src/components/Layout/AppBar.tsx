import React from 'react';

import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import useMediaQuery from '@mui/material/useMediaQuery';

import { Breakpoint, Theme, styled } from '@mui/material/styles';

import { AppBarProps, StyledAppBarProps } from '../../types/PropTypes';

import { config } from '@luminix/core';

import useMenu from '../../hooks/useMenu';
import useLayoutConfig from '../../hooks/useLayoutConfig';


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

    const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.up(
        config('luminix.cms.layout.breakpoint', 'md') as Breakpoint
    ));

    const AppBarComponent: React.FunctionComponent<StyledAppBarProps> = React.useMemo(() => isTablet
        ? DesktopAppBar
        : MobileAppBar, [isTablet]);

    const { open } = useMenu();

    const height = useLayoutConfig('appBar.height', undefined) as number;
    const drawerWidth = useLayoutConfig('drawer.width', 280) as number;


    const {
        title = document.title,
        end = null,
    } = slots;


    return (
        <AppBarComponent
            open={open}
            height={height}
            drawerWidth={drawerWidth}
            {...props}
        >
            <Toolbar>
                {/* drawer, menu button */}
                <Typography
                    width="100%"
                    variant="h6"
                    noWrap
                    component="div"
                >
                    {title}
                </Typography>
                    
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: 'flex' }}>
                    {end}
                </Box>
            </Toolbar>
        </AppBarComponent>
    );

};

export default AppBar;




