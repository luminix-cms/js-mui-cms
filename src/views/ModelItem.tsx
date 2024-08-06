import React from 'react';
import { app, Model } from '@luminix/core';
import { ModelForm } from '@luminix/react';
import { useNavigate, useParams } from 'react-router-dom';
import _ from 'lodash';

import useCurrentModel from '../hooks/useCurrentModel';
import useLayoutConfig from '../hooks/useLayoutConfig';
import useNotifications from '../hooks/useNotifications';
import useSetPageTitle from '../hooks/useSetPageTitle';

import Grid from '@mui/material/Unstable_Grid2';
import { Breakpoint } from '@mui/material';
import { isAxiosError } from 'axios';

const ModelItem: React.FunctionComponent = () => {

    const { id } = useParams();
    const { notify } = useNotifications();
    const navigate = useNavigate();
    const Model = useCurrentModel();
    const breakpoint = useLayoutConfig('breakpoint', 'md') as Breakpoint;

    const Breadcrumbs = app('cms').getComponent('Breadcrumbs');

    const [item, setItem] = React.useState<Model | undefined>();

    React.useEffect(() => {
        if (id === 'create') {
            setItem(new Model());
        } else {
            Model.find(id!).then((model) => setItem(model ?? undefined));
        }
    }, [id, Model]);
    
    useSetPageTitle(
        item?.exists
            ? `Edit ${_.lowerFirst(Model.singular())} “${item?.getLabel() || '...'}”`
            : `Create ${_.lowerFirst(Model.singular())}`
    );

    const handleSuccess = React.useCallback(() => {
        notify(`${Model.singular()} saved successfully!`);

        if (item?.wasRecentlyCreated) {
            navigate(`/${_.kebabCase(Model.plural())}/${item.getKey()}`);
        }

    }, [notify, navigate, Model, item]);

    const handleError = React.useCallback((error: unknown) => {
        if (!(error instanceof Error)) {
            throw error;
        }
        notify({
            message: isAxiosError(error)
                ? error.response?.data.message ?? error.message
                : error.message,
            severity: 'error',
        });
    }, [notify]);

    const additionalProps = React.useMemo(() => app('cms').getModelFormProps(item), [item]);
    
    if (!item) {
        return null;
    }

    return (
        <Grid container>
            <Grid xs={12}>
                <Breadcrumbs
                    parts={[
                        { name: Model.plural(), href: '/' + _.kebabCase(Model.plural()) },
                        { name: item.exists ? item.getLabel() : 'New' },
                    ]}
                />
            </Grid>
            <Grid
                xs={12}
                {...({ [breakpoint]: 6 })}
            >
                <ModelForm
                    submitText="Save"
                    {...additionalProps}
                    item={item}
                    onSuccess={handleSuccess}
                    onError={handleError}
                />
            </Grid>
        </Grid>
    );
}

export default ModelItem;
