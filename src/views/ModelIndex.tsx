import React from 'react';
import { app } from '@luminix/core';

import Grid from '@mui/material/Unstable_Grid2';

import TableSkeleton from '../components/ModelIndex/Table.skeleton';

import useSetPageTitle from '../hooks/useSetPageTitle';
import useCurrentQuery from '../hooks/useCurrentQuery';

const ModelIndex: React.FunctionComponent = () => {

    const {
        Model,
        items,
        error,
        loading,
    } = useCurrentQuery();

    useSetPageTitle(Model.plural());

    const {
        Error, // DesktopPageTitle, 
        ['ModelIndex.Table']: Table,
        ['ModelIndex.Pagination']: Pagination,
    } = app('cms').getComponents();

    if (error) {
        return <Error error={error} />;
    }

    return (
        <>
            {/* <DesktopPageTitle /> */}
            <Grid container spacing={2}>
                <Grid xs={12}>
                    {loading 
                        ? <TableSkeleton />
                        : (
                            <Table
                                items={items}
                                Model={Model}
                            />
                        )}
                </Grid>
                <Grid xs={12}>
                    <Pagination />
                </Grid>
            </Grid>
            
        </>
    );
}

export default ModelIndex;

