
import React from 'react';

import MuiTableHead, { TableHeadProps } from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';

import _ from 'lodash';
import useTable from '../../../hooks/useTable';
import { app } from '@luminix/core';




const TableHead: React.FunctionComponent<TableHeadProps> = (props) => {

    const {
        Model, massActions,
    } = useTable();

    const {
        ['ModelIndex.Table.ShrinkedCell']: ShrinkedCell,
    } = app('cms').getComponents();

    return (
        <MuiTableHead {...props}>
            <TableRow>
                {massActions.length > 0 && (
                    <ShrinkedCell>
                        <Checkbox />
                    </ShrinkedCell>
                )}
                <TableCell>
                    {_.upperFirst(Model.getSchema().labeledBy)}
                </TableCell>
                <ShrinkedCell></ShrinkedCell>
            </TableRow>
        </MuiTableHead>
    );
};

export default TableHead;