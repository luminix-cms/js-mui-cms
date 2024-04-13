
import React from 'react';

import MuiTableFooter, { TableFooterProps } from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Stack from '@mui/material/Stack';
import useTable from '../../../hooks/useTable';
import useIsDesktopMode from '../../../hooks/useIsDesktopMode';
import useLayoutConfig from '../../../hooks/useLayoutConfig';
import { Breakpoint } from '@mui/material';
import { app } from '@luminix/core';


const TableFooter: React.FunctionComponent<TableFooterProps> = ({ children, ...props }) => {

    const {
        columnCount
    } = useTable();

    const isDesktop = useIsDesktopMode();
    const breakpoint = useLayoutConfig('breakpoint', 'md') as Breakpoint;

    const {
        ['ModelIndex.Pagination']: Pagination,
        ['ModelIndex.PaginationDetails']: PaginationDetails,
        ['ModelIndex.PerPageSwitch']: PerPageSwitch,
    } = app('cms').getComponents();

    return (
        <MuiTableFooter {...props}>
            <TableRow>
                <TableCell colSpan={columnCount}>
                    <Stack
                        direction={isDesktop ? 'row' : 'column-reverse'}
                        alignItems="center"
                        justifyContent="space-between"
                        gap={3}
                    >
                        <Stack 
                            direction={isDesktop ? 'row' : 'column-reverse'}
                            alignItems={isDesktop ? 'center' : 'flex-start'}
                            justifyContent="flex-start"
                            width={{ xs: '100%', [breakpoint]: 'auto' }}
                            gap={isDesktop ? 2 : 0}
                        >
                            <PerPageSwitch />
                            <PaginationDetails />
                        </Stack>
                        <Pagination
                            variant={isDesktop ? 'default' : 'compact'}
                            justifyContent={{ xs: 'center', [breakpoint]: 'flex-end' }}
                            // sx={{ width: { [breakpoint]: '60%' } }}
                        />
                    </Stack>
                </TableCell>
            </TableRow>
            {children}
        </MuiTableFooter>
    );

};

export default TableFooter;