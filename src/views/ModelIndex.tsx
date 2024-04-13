import React from 'react';
import { Model, app } from '@luminix/core';

import Grid from '@mui/material/Unstable_Grid2';

import useSetPageTitle from '../hooks/useSetPageTitle';
import useCurrentQuery from '../hooks/useCurrentQuery';
import useIsDesktopMode from '../hooks/useIsDesktopMode';
import useLayoutConfig from '../hooks/useLayoutConfig';
import { Breakpoint } from '@mui/material';

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
        ['ModelIndex.Table']: Table,
        ['ModelIndex.Table.TableHead']: TableHead,
        ['ModelIndex.Table.TableBody']: TableBody,
        ['ModelIndex.Table.TableBody.TableRow']: TableRow,
        ['ModelIndex.Pagination']: Pagination,
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
                >
                    <Pagination
                        variant="compact"
                        justifyContent={{ xs: 'center', [breakpoint]: 'flex-end' }}
                    />
                </Grid>
                <Grid xs={12}>
                    <Table
                        items={items}
                        loading={loading}
                        error={error}
                        Model={Model}
                    >
                        <TableHead />
                        <TableBody>
                            {(item: Model) => <TableRow key={item.id} item={item} />}
                        </TableBody>
                    </Table>
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

