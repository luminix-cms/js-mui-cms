import React from 'react';
import { app } from '@luminix/core';

import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';

import useSetPageTitle from '../hooks/useSetPageTitle';
import useCurrentQuery from '../hooks/useCurrentQuery';
import useIsDesktopMode from '../hooks/useIsDesktopMode';

const ModelIndex: React.FunctionComponent = () => {

    const {
        Model,
        items,
        error,
        loading,
    } = useCurrentQuery();

    useSetPageTitle(Model.plural());

    const isDesktop = useIsDesktopMode();

    const {
        ['ModelIndex.Table']: Table,
        ['ModelIndex.Pagination']: Pagination,
    } = app('cms').getComponents();

    return (
        <>
            {/* <DesktopPageTitle /> */}
            <Grid container spacing={2}>
                <Grid xs={12} lg={6}>
                    <Button variant="contained">
                        Create {Model.singular()}
                    </Button>
                </Grid>
                <Grid xs={12} lg={6}>
                    <Pagination
                        variant="compact"
                        justifyContent={{ xs: 'center', lg: 'flex-end' }}
                    />
                </Grid>
                <Grid xs={12}>
                    <Table
                        items={items}
                        loading={loading}
                        error={error}
                        Model={Model}
                    />
                </Grid>
                <Grid xs={12}>
                    <Pagination 
                        variant={isDesktop ? 'default' : 'compact'}
                    />
                </Grid>
            </Grid>
            
        </>
    );
}

export default ModelIndex;

