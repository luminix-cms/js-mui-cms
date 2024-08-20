
import React from 'react';
import { app } from '@luminix/core';

import { TableFooterProps } from '@mui/material/TableFooter';

import {
    Breakpoint,
    TableFooter as MuiTableFooter,
    TableRow,
    TableCell,
    Stack,
} from '@mui/material';

import useTable from '../../../hooks/useTable';
import useIsDesktopMode from '../../../hooks/useIsDesktopMode';
import useLayoutConfig from '../../../hooks/useLayoutConfig';


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