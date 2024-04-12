import { useContext } from "react";

import LayoutContext from "../contexts/LayoutContext";

/**
 *
 * Gets whether the current layout is desktop mode.
 * 
 * @returns {boolean} Whether the current layout is desktop mode.
 */
export default function useIsDesktopMode() {

    const { isBreakpointUp } = useContext(LayoutContext);

    return isBreakpointUp;

}


