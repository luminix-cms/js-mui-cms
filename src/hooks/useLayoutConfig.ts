import { useContext, useMemo } from "react";
import { Obj } from '@luminix/support';

import LayoutContext from "../contexts/LayoutContext";


/**
 * 
 * Gets the value of a layout configuration.
 * 
 * @param {string} path The path to the configuration.
 * @param {unknown} defaultValue The default value to return if the configuration is not found.
 */
export default function useLayoutConfig(path: string, defaultValue?: unknown)
{
    const { layout } = useContext(LayoutContext);

    return useMemo(() => Obj.get(layout, path, defaultValue), [layout, path, defaultValue]);
}

