import React from 'react';

import {
    Table as MuiTable,
    TableContainer,
    Paper,
} from '@mui/material';

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






