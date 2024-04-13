import { Model } from '@luminix/core';

import {
    DrawerProps as MuiDrawerProps, AppBarProps as MuiAppBarProps, BoxProps,
    DrawerProps, MenuProps, TableProps as MuiTableProps,
    StackProps, TableHeadProps as MuiTableHeadProps, TableBodyProps as MuiTableBodyProps,
    TableRowProps as MuiTableRowProps
} from '@mui/material';

import { ListTypeMap } from '@mui/material/List';
import { Theme } from '@mui/material/styles';

import { DefaultComponentProps } from '@mui/material/OverridableComponent';
import { MenuItem } from './Menu';
import { ModelPaginatedResponse } from '@luminix/core/dist/types/Model';
import { Collection, CollectionIteratorCallback } from '@luminix/core/dist/types/Collection';
import { Scope } from '@luminix/core/dist/types/Builder';
import { TableContextValue } from './Contexts';

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

export type SearchBarProps = {
    throttle?: number,
};

export type ErrorProps = {
    error?: Error,
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

export type TableProps = MuiTableProps & {
    items?: Collection<Model>,
    loading?: boolean,
    error: Error | null,
    Model: typeof Model,
    children: React.ReactNode | ((props: TableContextValue) => React.ReactNode),
};

export type TableHeadProps = MuiTableHeadProps & {
    slots?: {
        before?: React.ReactNode,
        after?: React.ReactNode,
    }
};

export type TableRowProps = MuiTableRowProps & {
    item: Model,
};

export type TableBodyProps = MuiTableBodyProps & {
    children: React.ReactNode | CollectionIteratorCallback<Model, React.ReactNode>,
    //(item: Model) => React.ReactNode,
}

export type PaginationProps = StackProps & {
    variant?: 'default' | 'compact',
};

export type QueryProviderProps = {
    Model: typeof Model,
    scope?: Scope<Model, ModelPaginatedResponse>,
    dependencies?: unknown[],
};

