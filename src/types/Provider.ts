import { Dispatch, SetStateAction } from "react";
import { CmsConfig } from "./Config";

export type LayoutProviderValue = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    layout: CmsConfig['layout'],
    isBreakpointUp: boolean,
    currentPage: string,
    setCurrentPage: Dispatch<SetStateAction<string>>,
};




