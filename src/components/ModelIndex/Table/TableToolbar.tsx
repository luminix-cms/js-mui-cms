import React from 'react';

import { app } from '@luminix/core';

import {
    Breakpoint,
    TableRow,
    TableCell,
    Stack,
} from '@mui/material';

import useTable from '../../../hooks/useTable';
import useIsDesktopMode from '../../../hooks/useIsDesktopMode';
import useLayoutConfig from '../../../hooks/useLayoutConfig';


const TableToolbar: React.FunctionComponent = () => {

    const {
        columnCount
    } = useTable();

    const {
        ['ModelIndex.Filter']: Filter,
        ['ModelIndex.MassActions']: MassActions,
        ['ModelIndex.Sort']: Sort,
        ['ModelIndex.Pagination']: Pagination,
        // ['ModelIndex.PaginationDetails']: PaginationDetails,
    } = app('cms').getComponents();

    const isDesktop = useIsDesktopMode();

    const breakpoint = useLayoutConfig('breakpoint', 'md') as Breakpoint;

    return (
        <TableRow>
            <TableCell colSpan={columnCount} sx={{ p: 1 }}>
                <Stack
                    direction={{ xs: 'column', [breakpoint]: 'row' }}
                    justifyContent="space-between"
                    spacing={1}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        width={{ [breakpoint]: '100%' }}
                    >
                        <Filter />
                        {!isDesktop && <Sort />}
                    </Stack>
                    {isDesktop && (
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent={{ xs: 'center', [breakpoint]: 'flex-end' }}
                            rowGap={2}
                        >
                            <Pagination
                                variant="compact"
                                justifyContent="end"
                            />
                        </Stack>
                    )}
                    <MassActions />
                </Stack>
                
            </TableCell>
        </TableRow>
    );
};

export default TableToolbar;