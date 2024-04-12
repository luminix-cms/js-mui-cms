
import React from 'react';
import { TableContextValue } from '../types/Contexts';
import { Model, collect } from '@luminix/core';


const TableContext = React.createContext<TableContextValue>({
    columns: [],
    massActions: [],
    items: collect([]),
    Model: null as unknown as typeof Model,
});


export default TableContext;
