import React from 'react';

import TableCell, { TableCellProps } from '@mui/material/TableCell';


const ShrinkedCell: React.FunctionComponent<TableCellProps> = ({ children, ...props }) => {
    return (
        <TableCell
            sx={{ width: '1px' }}
            padding="checkbox"
            {...props}
        >
            {children}
        </TableCell>
    );
};

export default ShrinkedCell;


