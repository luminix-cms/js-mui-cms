
import React from 'react';

import { app } from '@luminix/core';
import { useApplyReducers } from '@luminix/react';

import { Column, MassAction } from '../types/Table';
import TableContext from '../contexts/TableContext';

import _ from 'lodash';
import { TableProps } from '../types/PropTypes';
import useIsDesktopMode from '../hooks/useIsDesktopMode';

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

    const isDesktop = useIsDesktopMode();

    const preMassActions = useApplyReducers(
        app('cms'),
        `modelMassActions`,
        DEFAULT_MASS_ACTIONS
    ) as MassAction[];

    const massActions = useApplyReducers(
        app('cms'),
        `model${_.upperFirst(_.camelCase(Model.getSchemaName()))}MassActions`,
        preMassActions
    ) as MassAction[];
    
    const columns = useApplyReducers(
        app('cms'),
        `model${_.upperFirst(_.camelCase(Model.getSchemaName()))}Columns`,
        DEFAULT_COLUMNS
    ) as Column[];

    const dataColumns = isDesktop ? columns.length : 1;

    const columnCount = dataColumns + (
        massActions.length > 0
            ? 2
            : 1
    );
    
    const value = {
        columns,
        columnCount,
        massActions,
        items,
        loading,
        Model,
    };

    return (
        <TableContext.Provider value={value}>
            {typeof children !== 'function' && children}
            {typeof children === 'function' && children(value)}
        </TableContext.Provider>
    )


}



export default TableProvider;




