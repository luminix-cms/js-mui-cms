import { useContext, useMemo } from "react";
import { LayoutContext } from "../providers/LayoutProvider";
import _ from "lodash";

export default function useLayoutConfig(path: string, defaultValue?: unknown)
{
    const { layout } = useContext(LayoutContext);

    return useMemo(() => _.get(layout, path, defaultValue), [layout, path, defaultValue]);
}

