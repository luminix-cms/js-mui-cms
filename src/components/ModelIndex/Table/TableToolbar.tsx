import React from 'react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import useTable from '../../../hooks/useTable';
import { app } from '@luminix/core';
import useIsDesktopMode from '../../../hooks/useIsDesktopMode';

const TableToolbar: React.FunctionComponent = () => {

    const {
        columnCount
    } = useTable();

    const {
        ['ModelIndex.Sort']: Sort,
    } = app('cms').getComponents();

    const isDesktop = useIsDesktopMode();


    return (
        <TableRow>
            <TableCell colSpan={columnCount}>
                {!isDesktop && <Sort />}
            </TableCell>
        </TableRow>
    );
};

export default TableToolbar;