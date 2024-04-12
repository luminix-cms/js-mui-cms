import React from 'react';

import { TableProps } from '../../types/PropTypes';

import MuiTable from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

import TableBody from './Table/TableBody';
import TableHead from './Table/TableHead';
import TableProvider from '../../providers/TableProvider';

const Table: React.FunctionComponent<TableProps> = ({ items, Model }) => {

    return (
        <TableProvider Model={Model} items={items}>
            <TableContainer component={Paper}>
                <MuiTable>
                    <TableHead />
                    <TableBody />
                    {/* <TableFooter>
                        <TableRow>
                            <TableCell colSpan={Model.fields.length} align="right">
                                {items.length} items
                            </TableCell>
                        </TableRow>
                    </TableFooter> */}
                </MuiTable>

            </TableContainer>
        </TableProvider>
    );
};

export default Table;






