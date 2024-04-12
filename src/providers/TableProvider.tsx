
import React from 'react';

import { app } from '@luminix/core';
import { useApplyReducers } from '@luminix/react';

import { Column, MassAction } from '../types/Table';
import TableContext from '../contexts/TableContext';

import _ from 'lodash';
import { TableProps } from '../types/PropTypes';

const DEFAULT_MASS_ACTIONS = [
    {
        label: 'Delete',
        name: 'delete',
    },
];

const TableProvider: React.FunctionComponent<TableProps> = ({ Model, items, loading, children }) => {

    const DEFAULT_COLUMNS = React.useMemo(() => [
        {
            key: Model.getSchema().labeledBy,
            label: _.upperFirst(_.camelCase(Model.getSchema().labeledBy)),
        }
    ], [Model]);

    const massActions = useApplyReducers(
        app('cms'),
        `model${_.upperFirst(_.camelCase(Model.getSchemaName()))}MassActions`,
        DEFAULT_MASS_ACTIONS
    ) as MassAction[];
    
    const columns = useApplyReducers(
        app('cms'),
        `model${_.upperFirst(_.camelCase(Model.getSchemaName()))}Columns`,
        DEFAULT_COLUMNS
    ) as Column[];

    return (
        <TableContext.Provider
            value={{
                columns,
                massActions,
                items,
                loading,
                Model,
            }}
        >
            {children}
        </TableContext.Provider>
    )


}



export default TableProvider;




