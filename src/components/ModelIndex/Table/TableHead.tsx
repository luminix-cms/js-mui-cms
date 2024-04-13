
import React from 'react';
import { app } from '@luminix/core';

import MuiTableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';

import useTable from '../../../hooks/useTable';
import { TableHeadProps } from '../../../types/PropTypes';
import useIsDesktopMode from '../../../hooks/useIsDesktopMode';

const TableHead: React.FunctionComponent<TableHeadProps> = ({ children, ...props}) => {

    const {
        massActions, columns
    } = useTable();

    const isDesktop = useIsDesktopMode();

    const {
        ['ModelIndex.Table.ShrinkedCell']: ShrinkedCell,
    } = app('cms').getComponents();

    return (
        <MuiTableHead {...props}>
            {children}
            {isDesktop && (
                <TableRow>
                    {massActions.length > 0 && (
                        <ShrinkedCell>
                            <Checkbox />
                        </ShrinkedCell>
                    )}
                    {columns.map(({ key, label, sortable = true, ...props }) => (
                        <TableCell
                            key={key}
                            sx={{
                                cursor: sortable ? 'pointer' : 'default',
                            }}
                            {...props}
                        >
                            {label}
                        </TableCell>
                    ))}
                    <ShrinkedCell></ShrinkedCell>
                </TableRow>
            )}
        </MuiTableHead>
    );
};

export default TableHead;