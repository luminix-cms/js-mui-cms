import { Model } from '@luminix/core';

import { DrawerProps as MuiDrawerProps, AppBarProps as MuiAppBarProps, BoxProps, DrawerProps } from '@mui/material';

import { Theme } from '@mui/material/styles';


export type LuminixCmsProps = {
    theme?: Theme
};

export type LayoutProps = BoxProps & {
    slotProps?: {
        AppBar?: AppBarProps,
        Drawer?: DrawerProps,
        main?: BoxProps,
    }
};


export type AppBarProps = {
    slots?: {
        start?: React.ReactNode | string,
        end?: React.ReactNode | string,
    }
};

export type StyledAppBarProps = MuiAppBarProps & {
    open?: boolean,
    drawerWidth?: number,
    height?: number,
};

export type StyledDrawerProps = MuiDrawerProps & {
    open?: boolean,
    width: number,
};

export type ModelComponentProps = {
    Model: typeof Model,
};

