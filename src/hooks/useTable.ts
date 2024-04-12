import React from "react";
import TableContext from "../contexts/TableContext";

export default function useTable()
{
    return React.useContext(TableContext);
}


