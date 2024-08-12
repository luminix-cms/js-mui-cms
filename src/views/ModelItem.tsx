import _ from 'lodash';

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { app, Model } from '@luminix/core';
import { ModelForm } from '@luminix/react';

import { ModelItemProps } from '../types/PropTypes';
import { useTranslation } from 'react-i18next';

import useCurrentModel from '../hooks/useCurrentModel';
import useLayoutConfig from '../hooks/useLayoutConfig';
import useSetPageTitle from '../hooks/useSetPageTitle';
import useBackButton from '../hooks/useBackButton';
import useHandleError from '../hooks/useHandleError';
import useNotify from '../hooks/useNotify';

import { Breakpoint } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

const ModelItem: React.FunctionComponent<ModelItemProps> = ({ create = false }) => {

    const [item, setItem] = React.useState<Model | undefined>();

    const { id } = useParams();
    const { t } = useTranslation();
    const notify = useNotify();
    const navigate = useNavigate();
    const Model = useCurrentModel();
    const breakpoint = useLayoutConfig('breakpoint', 'md') as Breakpoint;

    useSetPageTitle(
        item?.exists
            ? t('Edit :model “:label“', { model: Model.singular(), label: item?.getLabel() || '...' })
            : t('Create :model', { model: Model.singular() })
    );
    useBackButton();

    const Breadcrumbs = app('cms').getComponent('Breadcrumbs');

    React.useEffect(() => {
        if (id === 'create') {
            setItem(new Model());
        } else {
            Model.find(id!).then((model) => setItem(model ?? undefined));
        }
    }, [id, Model]);

    const handleSuccess = React.useCallback(() => {
        notify(t(':model saved successfully', { model: Model.singular() }));

        if (item?.wasRecentlyCreated) {
            navigate(`/${_.kebabCase(Model.plural())}/${item.getKey()}`);
        }

    }, [notify, navigate, Model, item]);

    const handleError = useHandleError();

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
                        { name: item.exists ? item.getLabel() : t('New') },
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
