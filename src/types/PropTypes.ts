import { Model } from '@luminix/core';

import { DrawerProps as MuiDrawerProps, AppBarProps as MuiAppBarProps, BoxProps, DrawerProps, MenuProps } from '@mui/material';
import { ListTypeMap } from '@mui/material/List';
import { Theme } from '@mui/material/styles';

import { DefaultComponentProps } from '@mui/material/OverridableComponent';
import { MenuItem } from './Menu';

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

export type ErrorProps = {
    error: Error,
};

export type RecursiveListProps = DefaultComponentProps<ListTypeMap> & {
    collapsed?: boolean;
    items: MenuItem[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick?: (e: any) => void;
};

export type RecursiveMenuProps = MenuProps & {
    collapsed?: boolean;
    items: MenuItem[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick?: (e: any) => void;
    // RecursiveList: FunctionComponent<RecursiveListProps>;
}

export type ModelComponentProps = {
    Model: typeof Model,
};

