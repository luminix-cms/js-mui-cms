import React from 'react';

import MuiTableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import Skeleton from './TableBody/Skeleton';

import useTable from '../../../hooks/useTable';
import { TableBodyProps } from '../../../types/PropTypes';
import { Model, app, collect } from '@luminix/core';
import { CollectionIteratorCallback } from '@luminix/core/dist/types/Collection';
import useCurrentModel from '../../../hooks/useCurrentModel';

const TableBody: React.FunctionComponent<TableBodyProps> = ({ children, ...props }) => {

    const Model = useCurrentModel();

    const {
        items, loading, columnCount,
    } = useTable();

    const {

        ['ModelIndex.Actions']: Actions,
    } = app('cms').getComponents();

    const renderedChildren = React.isValidElement(children) 
        ? children 
        : (items || collect([])).map(children as CollectionIteratorCallback<Model, React.ReactNode>);

    return (
        <MuiTableBody {...props}>
            {loading && <Skeleton />}
            {renderedChildren}
            {items && !items.count() && (
                <TableRow>
                    <TableCell colSpan={columnCount} sx={{ textAlign: 'center', py: 10 }}>
                        <Typography>
                            No {Model.plural().toLocaleLowerCase()} found
                        </Typography>
                        <br />
                        <Actions />
                    </TableCell>
                </TableRow>
            )}
        </MuiTableBody>
    );

};


export default TableBody;