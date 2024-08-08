import React from 'react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Stack from '@mui/material/Stack';
import useTable from '../../../hooks/useTable';
import { app } from '@luminix/core';
import useIsDesktopMode from '../../../hooks/useIsDesktopMode';
import useLayoutConfig from '../../../hooks/useLayoutConfig';
import { Breakpoint } from '@mui/material';

const TableToolbar: React.FunctionComponent = () => {

    const {
        columnCount
    } = useTable();

    const {
        ['ModelIndex.Filter']: Filter,
        ['ModelIndex.MassActions']: MassActions,
        ['ModelIndex.Sort']: Sort,
        ['ModelIndex.Pagination']: Pagination,
        ['ModelIndex.PaginationDetails']: PaginationDetails,
    } = app('cms').getComponents();

    const isDesktop = useIsDesktopMode();

    const breakpoint = useLayoutConfig('breakpoint', 'md') as Breakpoint;

    return (
        <TableRow>
            <TableCell colSpan={columnCount} sx={{ p: 1 }}>
                <Stack
                    direction={{ xs: 'column', [breakpoint]: 'row' }}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        width={{ [breakpoint]: '100%' }}
                    >
                        <Filter />
                        {!isDesktop && <Sort />}
                        <MassActions
                            sx={{
                                marginLeft: 'auto',
                                // inWidth: 160,
                            }}
                        />
                    </Stack>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent={{ xs: 'center', [breakpoint]: 'flex-end' }}
                        spacing={2}
                    >
                        {isDesktop && <PaginationDetails />}
                        <Pagination
                            variant="compact"
                            justifyContent={{ xs: 'end' }}
                        />
                    </Stack>
                </Stack>
                
            </TableCell>
        </TableRow>
    );
};

export default TableToolbar;