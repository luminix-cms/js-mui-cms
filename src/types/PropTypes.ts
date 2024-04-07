import { Model } from '@luminix/core';

import { AppBarProps as MuiAppBarProps } from '@mui/material';

import { Theme } from '@mui/material/styles';


export type LuminixCmsProps = {
    theme?: Theme
}


export type AppBarProps = {
    slots?: {
        title?: React.ReactNode | string,
        end?: React.ReactNode,
    }
};



export type StyledAppBarProps = MuiAppBarProps & {
    open?: boolean,
    drawerWidth?: number,
    height?: number,
};



export type ModelComponentProps = {
    Model: typeof Model,
};

