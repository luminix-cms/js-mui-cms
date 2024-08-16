import { Model } from '@luminix/core';
import { Collection } from '@luminix/core/dist/types/Collection';
import { TableCellProps } from '@mui/material';
import { NotifyFunction } from './Notifications';
import { DialogFunction } from './Dialog';
import { TFunction } from 'i18next';

export type StaticAction = {
    label: string;
    callback: (e: ActionCallbackEvent) => void;
    icon?: React.ReactNode;
}

export type InstanceAction = {
    label: string;
    callback: (e: InstanceActionCallbackEvent) => void;
    icon?: React.ReactNode;
}

export type MassAction = {
    label: string;
    key: string;
    callback: (e: MassActionCallbackEvent) => void;
};

export type ActionCallbackEvent = {
    navigate: (path: string) => void;
    refresh: () => void;
    notify: NotifyFunction;
    dialog: DialogFunction;
    t: TFunction;
}

export type InstanceActionCallbackEvent = ActionCallbackEvent & {
    item: Model;
};

export type MassActionCallbackEvent = ActionCallbackEvent & {
    selected: Collection<Model>;
};

export type Column = TableCellProps & {
    key: string;
    label: string;
    sortable?: boolean;
};
