import React from 'react';
import { app, log } from '@luminix/core';
import { useBrowsableQuery } from '@luminix/react';

import Grid from '@mui/material/Unstable_Grid2';

import ModelIndexSkeleton from './ModelIndex.skeleton';

import useSetPageTitle from '../hooks/useSetPageTitle';
import useSearch from '../hooks/useSearch';

import { ModelComponentProps } from '../types/PropTypes';

const ModelIndex: React.FunctionComponent<ModelComponentProps> = ({ Model }) => {

    const query = React.useMemo(() => {
        const query = Model.query();
        log().info('ModelIndex: query', { Model, query });
        return query;
    }, [Model]);

    const {
        data: items,
        loading,
        error,
        links: compactLinks,
        meta: { links } = {},
    } = useBrowsableQuery(query);

    useSetPageTitle(Model.plural());

    useSearch();

    const {
        Error, // DesktopPageTitle, 
        ['ModelIndex.Table']: Table,
        ['ModelIndex.Pagination']: Pagination,
    } = app('cms').getComponents();

    if (error) {
        return <Error error={error} />;
    }

    if (loading) {
        return <ModelIndexSkeleton />;
    }


    return (
        <>
            {/* <DesktopPageTitle /> */}
            <Grid container spacing={2}>
                <Grid xs={12}>
                    {items && (
                        <Table
                            items={items}
                            Model={Model}
                        />
                    )}
                </Grid>
                <Grid xs={12}>
                    <Pagination
                        links={links}
                        compactLinks={compactLinks}
                    />
                </Grid>
            </Grid>
            
        </>
    );
}

export default ModelIndex;

