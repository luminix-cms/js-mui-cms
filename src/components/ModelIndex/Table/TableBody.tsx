import React from 'react';

import MuiTableBody from '@mui/material/TableBody';

import Skeleton from './TableBody/Skeleton';

import useTable from '../../../hooks/useTable';
import { TableBodyProps } from '../../../types/PropTypes';

const TableBody: React.FunctionComponent<TableBodyProps> = ({ children, ...props }) => {

    const {
        items, loading,
    } = useTable();

    return (
        <MuiTableBody {...props}>
            {loading && <Skeleton />}
            {typeof children !== 'function' && children}
            {items && typeof children === 'function' && items.map((item) => children(item))}
        </MuiTableBody>
    );

};


export default TableBody;