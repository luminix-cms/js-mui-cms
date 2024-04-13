import React from 'react';

import { app } from '@luminix/core';

import MuiTable from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

// import TableBody from './Table/TableBody';
// import TableHead from './Table/TableHead';
import TableProvider from '../../providers/TableProvider';
import { TableProps } from '../../types/PropTypes';

const Table: React.FunctionComponent<TableProps> = ({
    items, loading, Model, error, slots = {},
    ...props
}) => {

    const {
        ['ModelIndex.Table.TableHead']: TableHead,
        ['ModelIndex.Table.TableBody']: TableBody,
    } = app('cms').getComponents();

    const {
        tableHead, tableFooter
    } = slots;

    return (
        <TableProvider
            Model={Model}
            items={items}
            loading={loading}
            error={error}
        >
            <TableContainer component={Paper}>
                <MuiTable {...props}>
                    <TableHead slots={tableHead} />
                    <TableBody />
                    {tableFooter}
                </MuiTable>

            </TableContainer>
        </TableProvider>
    );
};

export default Table;






