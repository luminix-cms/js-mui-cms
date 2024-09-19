import { Collection } from '@luminix/support';
import { ModelType as Model } from '@luminix/core';

import { TableCellProps } from '@mui/material';
import { TFunction } from 'i18next';

import { NotifyFunction } from './Notifications';
import { DialogFunction } from './Dialog';

export type StaticAction = {
    key?: string;
    label: string;
    callback: (e: ActionCallbackEvent) => void;
    icon?: React.ReactNode;
}

export type InstanceAction = {
    key?: string;
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
