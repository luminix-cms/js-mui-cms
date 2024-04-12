import { Dispatch, SetStateAction } from "react";

import { Model } from "@luminix/core";
import { BuilderInterface } from "@luminix/core/dist/types/Builder";
import { ModelPaginatedLink, ModelPaginatedResponse } from "@luminix/core/dist/types/Model";
import { Collection } from "@luminix/core/dist/types/Collection";

import { CmsConfig } from "./Config";
import { Column, MassAction } from "./Table";

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

export type QueryContextValue = {
    query: BuilderInterface<Model, ModelPaginatedResponse>,
    refresh: () => void;
    items?: Collection<Model>;
    links?: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta?: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
        links: ModelPaginatedLink[];
    };
    loading: boolean;
    error: Error | null;
    Model: typeof Model;
};

export type TableContextValue = {
    columns: Column[],
    massActions: MassAction[],
    items: Collection<Model>,
    Model: typeof Model,
};




