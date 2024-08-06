import React from 'react';
import { Model, app } from '@luminix/core';
import { usePagination } from '@luminix/react';

import Grid from '@mui/material/Unstable_Grid2';
import { Breakpoint } from '@mui/material';

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
        Breadcrumbs,
        ['ModelIndex.Actions']: Actions,
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
                <Grid
                    xs={12}
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                >
                    <Breadcrumbs
                        parts={[
                            { name: Model.plural() },
                        ]}
                    />
                    <Actions variant={isDesktop ? 'default' : 'fab'} />
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

