import React from "react";
import QueryContext from "../contexts/QueryContext";

/**
 * 
 * Gets the current query from the QueryContext.
 * 
 */
export default function useCurrentQuery()
{
    const {
        items,
        loading,
        error,
        meta,
        links,
        Model,
    } = React.useContext(QueryContext);

    return {
        items,
        loading,
        error,
        meta,
        links,
        Model,
    };

}
