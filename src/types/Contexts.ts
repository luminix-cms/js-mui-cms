/* eslint-disable @typescript-eslint/no-explicit-any */

import { Dispatch, SetStateAction } from "react";
import { SetURLSearchParams } from "react-router-dom";

import { Model } from "@luminix/core";
import { Collection } from "@luminix/core/dist/types/Collection";

import { CmsConfig } from "./Config";
import { Column, MassAction } from "./Table";
import { Notification, NotifyFunction } from "./Notifications";
import { DialogFunction, DialogMessage } from "./Dialog";
import { FilteredColumn } from "./Filter";

export type LayoutContextValue = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    layout: CmsConfig['layout'],
    isBreakpointUp: boolean,
    currentPage: string,
    setCurrentPage: Dispatch<SetStateAction<string>>,
    showSearch: boolean,
    setShowSearch: Dispatch<SetStateAction<boolean>>,
    showBackButton: boolean,
    setShowBackButton: Dispatch<SetStateAction<boolean>>,
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

export type ModelFilterContextValue = {
    Model: typeof Model,
    anchorEl: any,
    setAnchorEl: React.Dispatch<React.SetStateAction<any>>,
    columnsFilter: FilteredColumn[],
    setColumnsFilter: React.Dispatch<React.SetStateAction<FilteredColumn[]>>,
    searchParams: URLSearchParams, 
    setSearchParams: SetURLSearchParams,
    clearSearchParams: () => void,
    clearFilters: () => void,
};

export type ModelFilterRowContextValue = {
    key: string, 
    type: string, 
    operator: string, 
    value: any, 
    isRelation: boolean, 
    //
    setKey: React.Dispatch<React.SetStateAction<string>>, 
    setType: React.Dispatch<React.SetStateAction<string>>, 
    setOperator: React.Dispatch<React.SetStateAction<string>>, 
    setValue: React.Dispatch<React.SetStateAction<any>>,
    setIsRelation: React.Dispatch<React.SetStateAction<boolean>>, 
}

export type NotificationContextValue = {
    isOpen: boolean,
    notify: NotifyFunction,
    dismissNotification: () => void,
    notifications: Notification[],
    current?: Notification,
    displacement: string,
    setDisplacement: React.Dispatch<React.SetStateAction<string>>,
};

export type DialogContextValue = {
    isOpen: boolean,
    dialog: DialogFunction,
    dismissDialog: () => void,
    current?: DialogMessage,

};
