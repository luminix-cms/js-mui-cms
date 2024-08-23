import { Model, Plugin } from '@luminix/core';

import {
    DrawerProps as MuiDrawerProps, AppBarProps as MuiAppBarProps, BoxProps,
    DrawerProps, MenuProps, TableProps as MuiTableProps,
    StackProps, TableHeadProps as MuiTableHeadProps, TableBodyProps as MuiTableBodyProps,
    TableRowProps as MuiTableRowProps,
    ThemeOptions,
    BreadcrumbsOwnProps,
    SnackbarProps,
    AlertProps
} from '@mui/material';

import { ListTypeMap } from '@mui/material/List';

import { DefaultComponentProps } from '@mui/material/OverridableComponent';
import { MenuItem } from './Menu';
import { ModelPaginatedResponse } from '@luminix/core/dist/types/Model';
import { Collection, CollectionIteratorCallback } from '@luminix/core/dist/types/Collection';
import { Scope } from '@luminix/core/dist/types/Builder';
import { InitOptions } from 'i18next';
import { LuminixProviderProps } from '@luminix/react/dist/components/LuminixProvider';
// import { TableContextValue } from './Contexts';

export type LuminixCmsProps = Partial<LuminixProviderProps> & {
    theme?: ThemeOptions,
    i18nOptions?: InitOptions,
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
    onClick?: (e: any) => void;
};

export type RecursiveMenuProps = MenuProps & {
    collapsed?: boolean;
    items: MenuItem[];
    onClick?: (e: any) => void;
    // RecursiveList: FunctionComponent<RecursiveListProps>;
}

export type ModelProviderProps = {
    Model: typeof Model;
    children: React.ReactNode;
};

export type TableProps = MuiTableProps & {
    items?: Collection<Model>,
    loading?: boolean,
    error: Error | null,
    // children: React.ReactNode | ((props: TableContextValue) => React.ReactNode),
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

export type ModelItemProps = {
    create?: boolean,
};

export type QueryProviderProps = {
    Model: typeof Model,
    scope?: Scope<Model, ModelPaginatedResponse>,
    dependencies?: unknown[],
};


export type ActionsProps = {
    variant?: 'default' | 'fab',
};

export type NotificationProviderProps = SnackbarProps & {
    variant?: AlertProps['variant'],
};

export type BreadcrumbsProps = BreadcrumbsOwnProps & {
    parts?: {
        name: string,
        href?: string
    }[],
};

export type InputOption = { 
    key: string, 
    label: string, 
}
