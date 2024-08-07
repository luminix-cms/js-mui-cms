import { Model } from '@luminix/core';
import { Collection } from '@luminix/core/dist/types/Collection';
import { TableCellProps } from '@mui/material';
import { NotifyFunction } from './Notifications';

export type Action = {
    label: string;
    callback: () => void;
    icon?: React.ReactNode;
}

export type MassAction = {
    label: string;
    key: string;
    callback: (e: MassActionCallbackEvent) => void;
};

export type MassActionCallbackEvent = {
    selected: Collection<Model>;
    navigate: (path: string) => void;
    refresh: () => void;
    notify: NotifyFunction;
};

export type Column = TableCellProps & {
    key: string;
    label: string;
    sortable?: boolean;
};
