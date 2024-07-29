import React from 'react';

import MuiTable from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

import TableProvider from '../../providers/TableProvider';
import { TableProps } from '../../types/PropTypes';

const Table: React.FunctionComponent<TableProps> = ({
    items, loading, error, children,
    ...props
}) => {

    return (
        <TableProvider
            items={items}
            loading={loading}
            error={error}
        >
            <TableContainer component={Paper}>
                <MuiTable {...props}>
                    {children}
                </MuiTable>
            </TableContainer>
        </TableProvider>
    );
};

export default Table;






