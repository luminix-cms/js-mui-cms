
import React from 'react';
import { TableContextValue } from '../types/Contexts';
import { Model, collect } from '@luminix/core';


const TableContext = React.createContext<TableContextValue>({
    columns: [],
    columnCount: 0,
    selected: collect([]),
    massActions: [],
    items: collect([]),
    error: new Error('Trying to access TableContext outside of TableProvider'),
    Model: null as unknown as typeof Model,
});


export default TableContext;
