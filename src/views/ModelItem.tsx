import React from 'react';
import { app } from '@luminix/core';
import { ModelForm, useQuery } from '@luminix/react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import _ from 'lodash';

import useCurrentModel from '../hooks/useCurrentModel';
import useLayoutConfig from '../hooks/useLayoutConfig';
import useNotifications from '../hooks/useNotifications';
import useSetPageTitle from '../hooks/useSetPageTitle';

import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Unstable_Grid2';
import { Breakpoint } from '@mui/material';

const ModelItem: React.FunctionComponent = () => {

    const { id } = useParams();
    const { notify } = useNotifications();
    const Model = useCurrentModel();
    const breakpoint = useLayoutConfig('breakpoint', 'md') as Breakpoint;

    const query = React.useMemo(() => Model.query(), [Model]);

    const { data, error } = useQuery(query, {
        method: 'find',
        id,
    });
    
    useSetPageTitle(`Edit ${_.lowerFirst(Model.singular())} “${data?.first()?.getLabel() || '...'}”`);
    
    const ErrorView = app('cms').getComponent('Error');

    const handleSuccess = React.useCallback((response: AxiosResponse | void) => {
        if (!response) {
            return;
        }
        notify(`${Model.singular()} saved successfully!`);
    }, [notify, Model]);

    const handleError = React.useCallback((error: unknown) => {
        if (!(error instanceof Error)) {
            throw error;
        }
        notify({
            message: error.message,
            severity: 'error',
        });
    }, [notify]);
    
    if (error) {
        return <ErrorView error={error} />;
    }
    
    if (!data) {
        return null;
    }
    
    const item = data.first()!;

    return (
        <Grid container>
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
                    <Link
                        underline="hover"
                        color="inherit"
                        component={RouterLink}
                        to={'/' + _.kebabCase(Model.plural())}
                    >
                        {Model.plural()}
                    </Link>
                    <Typography color="text.primary">
                        {item.getKey()}
                    </Typography>
                </Breadcrumbs>
            </Grid>
            <Grid
                xs={12}
                {...({ [breakpoint]: 6 })}
            >
                <ModelForm
                    item={item}
                    onSuccess={handleSuccess}
                    onError={handleError}
                    submitText="Save"
                />
            </Grid>
        </Grid>
    );
}

export default ModelItem;
