import { useContext } from "react";
import { LayoutContext } from "../providers/LayoutProvider";


export default function useIsDesktopMode() {

    const { isBreakpointUp } = useContext(LayoutContext);

    return isBreakpointUp;

}


