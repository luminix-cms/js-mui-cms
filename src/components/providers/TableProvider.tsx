
import React from 'react';

import { Collection, Str } from '@luminix/support';
import { ModelType as Model, app, collect } from '@luminix/core';
import { useApplyReducers } from '@luminix/react';

import { useSearchParams } from 'react-router-dom';

import TableContext from '../../contexts/TableContext';
import { Column, MassAction } from '../../types/Table';
import { TableProps } from '../../types/PropTypes';

import useIsDesktopMode from '../../hooks/useIsDesktopMode';
import useCurrentModel from '../../hooks/useCurrentModel';

// const DEFAULT_MASS_ACTIONS = [
//     {
//         label: 'Delete',
//         name: 'delete',
//     },
// ];

const TableProvider: React.FunctionComponent<TableProps> = ({ items, loading, children, error }) => {

    const Model = useCurrentModel();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const selected: Collection<Model> = React.useMemo(() => collect([]), [Model, items]);
    const [searchParams] = useSearchParams();

    const currentTab = searchParams.get('tab') ?? 'all';

    const DEFAULT_COLUMNS = React.useMemo(() => [
        {
            key: Model.getSchema().labeledBy,
            label: Str.human(Model.getSchema().labeledBy),
        }
    ], [Model]);

    const isDesktop = useIsDesktopMode();

    const massActions: MassAction[] = React.useMemo(() => {
        return app('cms').getMassActions(Model, currentTab);
    }, [Model, currentTab]);
    
    const columns = useApplyReducers(
        app('cms'),
        `model${Str.studly(Model.getSchemaName())}Columns`,
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
        selected,
        error,
        Model,
    };

    return (
        <TableContext.Provider value={value}>
            {children}
        </TableContext.Provider>
    )


}



export default TableProvider;




