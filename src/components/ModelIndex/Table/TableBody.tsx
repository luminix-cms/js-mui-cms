import React from 'react';

import MuiTableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import Skeleton from './TableBody/Skeleton';

import useTable from '../../../hooks/useTable';
import { TableBodyProps } from '../../../types/PropTypes';
import { app } from '@luminix/core';
import { CollectionIteratorCallback } from '@luminix/core/dist/types/Collection';

const TableBody: React.FunctionComponent<TableBodyProps> = ({ children, ...props }) => {

    const {
        items, loading, columnCount, Model,
    } = useTable();

    const {

        ['ModelIndex.Actions']: Actions,
    } = app('cms').getComponents();

    return (
        <MuiTableBody {...props}>
            {loading && <Skeleton />}
            {typeof children !== 'function' && children}
            {items && typeof children === 'function' && items.map(children as CollectionIteratorCallback)}
            {items && !items.count() && (
                <TableRow>
                    <TableCell colSpan={columnCount} sx={{ textAlign: 'center' }}>
                        <Typography>
                            No {Model.plural().toLocaleLowerCase()} found
                        </Typography>
                        <br />
                        <Typography>
                            <Actions />
                        </Typography>
                    </TableCell>
                </TableRow>
            )}
        </MuiTableBody>
    );

};


export default TableBody;