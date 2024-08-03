import { Dispatch, SetStateAction } from "react";

import { Model } from "@luminix/core";
import { Collection } from "@luminix/core/dist/types/Collection";

import { CmsConfig } from "./Config";
import { Column, MassAction } from "./Table";
import { Notification } from "./Notifications";

export type LayoutContextValue = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    layout: CmsConfig['layout'],
    isBreakpointUp: boolean,
    currentPage: string,
    setCurrentPage: Dispatch<SetStateAction<string>>,
    showSearch: boolean,
    setShowSearch: Dispatch<SetStateAction<boolean>>,
};

export type TableContextValue = {
    columns: Column[],
    columnCount: number,
    massActions: MassAction[],
    items?: Collection<Model>,
    loading?: boolean,
    error: Error | null,
    Model: typeof Model, // TODO: remove this
    selected: Collection<Model>,
};

export type ModelContextValue = {
    Model: typeof Model,
};

export type NotificationContextValue = {
    isOpen: boolean,
    notify: (notification: string | Notification) => void,
    dismissNotification: () => void,
    notifications: Notification[],
    current?: Notification,
};

