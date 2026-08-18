import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { app, ModelType as Model } from '@luminix/core';
import { ModelForm } from '@luminix/react';

import {
    Unstable_Grid2 as Grid,
    Breakpoint, Box,
} from '@mui/material';

import { ModelItemProps } from '../types/PropTypes';

import useCurrentModel from '../hooks/useCurrentModel';
import useLayoutConfig from '../hooks/useLayoutConfig';
import useSetPageTitle from '../hooks/useSetPageTitle';
import useBackButton from '../hooks/useBackButton';
import useHandleError from '../hooks/useHandleError';
import useNotify from '../hooks/useNotify';
import { Str } from '@luminix/support';


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
        if (create) {
            setItem(new Model());
        } else {
            Model.find(id!).then((model) => setItem(model ?? undefined));
        }
    }, [id, Model, create]);

    const handleSuccess = React.useCallback(() => {
        notify(t(':model saved successfully', { model: Model.singular() }));

        if (item?.wasRecentlyCreated) {
            navigate(`/${Str.kebab(Model.plural())}/${item.getKey()}`, { replace: true });
        }

    }, [notify, navigate, Model, item, t]);

    const handleError = useHandleError();

    const additionalProps = React.useMemo(() => app('cms').getModelFormProps(item), [item]);
    
    if (!item) {
        return null;
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <Grid container>
                <Grid xs={12}>
                    <Breadcrumbs
                        parts={[
                            { name: Model.plural(), href: '/' + Str.kebab(Model.plural()) },
                            { name: item.exists ? item.getLabel() : t('New') },
                        ]}
                    />
                </Grid>
                <Grid
                    xs={12}
                    {...({ [breakpoint]: 6 })}
                >
                    <ModelForm
                        submitText={t('Save')}
                        {...additionalProps}
                        item={item}
                        onSuccess={handleSuccess}
                        onError={handleError}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default ModelItem;
