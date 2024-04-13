import React from 'react';

import MuiTable from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

import TableProvider from '../../providers/TableProvider';
import { TableProps } from '../../types/PropTypes';

const Table: React.FunctionComponent<TableProps> = ({
    items, loading, Model, error, children,
    ...props
}) => {

    return (
        <TableProvider
            Model={Model}
            items={items}
            loading={loading}
            error={error}
        >
            {(value) => (
                <TableContainer component={Paper}>
                    <MuiTable {...props}>
                        {typeof children !== 'function' && children}
                        {typeof children === 'function' && children(value)}
                    </MuiTable>
                </TableContainer>
            )}
        </TableProvider>
    );
};

export default Table;






