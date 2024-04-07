
import { useContext } from "react";
import { LayoutContext } from "../providers/LayoutProvider";

export default function useIsMobileMode() {
    const { isBreakpointUp } = useContext(LayoutContext);

    return !isBreakpointUp;

}


