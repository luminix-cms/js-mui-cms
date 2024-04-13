
import React from 'react';
import { app } from '@luminix/core';

import MuiTableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';

import useTable from '../../../hooks/useTable';
import { TableHeadProps } from '../../../types/PropTypes';

const TableHead: React.FunctionComponent<TableHeadProps> = ({ slots = {}, ...props}) => {

    const {
        massActions, columns
    } = useTable();

    const { before, after } = slots;

    const {
        ['ModelIndex.Table.ShrinkedCell']: ShrinkedCell,
    } = app('cms').getComponents();

    return (
        <MuiTableHead {...props}>
            {before}
            <TableRow>
                {massActions.length > 0 && (
                    <ShrinkedCell>
                        <Checkbox />
                    </ShrinkedCell>
                )}
                {columns.map(({ key, label }) => (
                    <TableCell key={key}>
                        {label}
                    </TableCell>
                ))}
                <ShrinkedCell></ShrinkedCell>
            </TableRow>
            {after}
        </MuiTableHead>
    );
};

export default TableHead;