import React from 'react';
import { Model, app } from '@luminix/core';
import { usePagination } from '@luminix/react';
import { Link as RouterLink } from 'react-router-dom';

import Grid from '@mui/material/Unstable_Grid2';
import { Breakpoint } from '@mui/material';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

import useSetPageTitle from '../hooks/useSetPageTitle';
import useIsDesktopMode from '../hooks/useIsDesktopMode';
import useLayoutConfig from '../hooks/useLayoutConfig';
import useSearch from '../hooks/useSearch';
import useCurrentModel from '../hooks/useCurrentModel';

const ModelIndex: React.FunctionComponent = () => {

    const Model = useCurrentModel();

    const {
        data,
        error,
        loading,
    } = usePagination();

    useSetPageTitle(Model.plural());

    useSearch();

    const isDesktop = useIsDesktopMode();

    const breakpoint = useLayoutConfig('breakpoint', 'md') as Breakpoint;

    const {
        ['ModelIndex.Actions']: Actions,
        ['ModelIndex.Pagination']: Pagination,
        ['ModelIndex.PaginationDetails']: PaginationDetails,
        ['ModelIndex.Table']: ModelTable,
        ['ModelIndex.Table.TableBody']: ModelTableBody,
        ['ModelIndex.Table.TableHead']: ModelTableHead,
        ['ModelIndex.Table.TableFooter']: ModelTableFooter,
        ['ModelIndex.Table.TableToolbar']: ModelTableToolbar,
        ['ModelIndex.Table.TableBody.TableRow']: ModelTableRow,
    } = app('cms').getComponents();

    return (
        <>
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="hover"
                            color="inherit"
                            to="/"
                            component={RouterLink}
                        >
                            Luminix CMS
                        </Link>
                        <Typography color="text.primary">
                            {Model.plural()}
                        </Typography>
                    </Breadcrumbs>
                </Grid>
                <Grid
                    xs={12}
                    {...({ [breakpoint]: 6 })}
                >
                    <Actions variant={isDesktop ? 'default' : 'fab'} />
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
                        items={data}
                        loading={loading}
                        error={error}
                    >
                        <ModelTableHead>
                            <ModelTableToolbar />
                        </ModelTableHead>
                        <ModelTableBody>
                            {(item: Model) => <ModelTableRow key={item.getKey()} item={item} />}
                        </ModelTableBody>
                        <ModelTableFooter />
                    </ModelTable>
                </Grid>
            </Grid>
            
        </>
    );
}

export default ModelIndex;

