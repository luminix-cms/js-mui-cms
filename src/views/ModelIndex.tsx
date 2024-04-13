import React from 'react';
import { Model, app } from '@luminix/core';

import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TableCell from '@mui/material/TableCell';

import useSetPageTitle from '../hooks/useSetPageTitle';
import useCurrentQuery from '../hooks/useCurrentQuery';
import useIsDesktopMode from '../hooks/useIsDesktopMode';
import useLayoutConfig from '../hooks/useLayoutConfig';
import { Breakpoint } from '@mui/material';
import { TableContextValue } from '../types/Contexts';

const ModelIndex: React.FunctionComponent = () => {

    const {
        Model,
        items,
        error,
        loading,
    } = useCurrentQuery();

    useSetPageTitle(Model.plural());

    const isDesktop = useIsDesktopMode();

    const breakpoint = useLayoutConfig('breakpoint', 'md') as Breakpoint;

    const {
        ['ModelIndex.Actions']: Actions,
        ['ModelIndex.Pagination']: Pagination,
        ['ModelIndex.PaginationDetails']: PaginationDetails,
        ['ModelIndex.PerPageSwitch']: PerPageSwitch,
        ['ModelIndex.Table']: ModelTable,
        ['ModelIndex.Table.TableHead']: ModelTableHead,
        ['ModelIndex.Table.TableBody']: ModelTableBody,
        ['ModelIndex.Table.TableBody.TableRow']: ModelTableRow,
    } = app('cms').getComponents();

    return (
        <>
            <Grid container spacing={2}>
                <Grid
                    xs={12}
                    {...({ [breakpoint]: 6 })}
                >
                    <Actions />
                </Grid>
                <Grid
                    xs={12}
                    {...({ [breakpoint]: 6 })}
                    display="flex"
                    flexDirection="row"
                    justifyContent={{ xs: 'center', [breakpoint]: 'flex-end' }}
                    alignItems="center"
                    gap={2}
                >
                    {isDesktop && <PaginationDetails />}
                    <Pagination
                        variant="compact"
                        justifyContent={{ xs: 'center', [breakpoint]: 'flex-end' }}
                    />
                 
                </Grid>
                <Grid xs={12}>
                    <ModelTable
                        items={items}
                        loading={loading}
                        error={error}
                        Model={Model}
                    >
                        {({ columnCount }: TableContextValue) => (
                            <>
                                <ModelTableHead />
                                <ModelTableBody>
                                    {(item: Model) => <ModelTableRow key={item.getKey()} item={item} />}
                                </ModelTableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={columnCount}>
                                            <Stack
                                                direction={isDesktop ? 'row' : 'column-reverse'}
                                                alignItems="center"
                                                justifyContent="space-between"
                                                gap={3}
                                            >
                                                <Stack 
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent={{ xs: 'space-between', [breakpoint]: 'flex-start' }}
                                                    width={{ xs: '100%', [breakpoint]: 'auto' }}
                                                    gap={2}
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
                                </TableFooter>
                            </>
                        )}
                    </ModelTable>
                </Grid>
            </Grid>
            
        </>
    );
}

export default ModelIndex;

