
import React from 'react';

import MuiTableHead, { TableHeadProps } from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';

import _ from 'lodash';
import useTable from '../../../hooks/useTable';




const TableHead: React.FunctionComponent<TableHeadProps> = (props) => {

    const { Model } = useTable();

    return (
        <MuiTableHead {...props}>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox />
                </TableCell>
                <TableCell>
                    {_.upperFirst(Model.getSchema().labeledBy)}
                </TableCell>
                <TableCell></TableCell>
            </TableRow>
        </MuiTableHead>
    );
};

export default TableHead;