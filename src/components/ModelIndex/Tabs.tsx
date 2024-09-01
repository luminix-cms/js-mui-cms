
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useApplyReducers } from '@luminix/react';
import { app } from '@luminix/core';

import {
    Tabs as MuiTabs,
    Tab,
    Box
} from '@mui/material';

import useCurrentModel from '../../hooks/useCurrentModel';
import { DisplayableTab } from '../../types/Tabs';
import { pascalCase } from '../../support/string';

function Tabs(): React.ReactNode {

    const Model = useCurrentModel();
    const { t } = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab') || 'all';

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setSearchParams(() => {
            const newParams = new URLSearchParams();
            if (newValue !== 'all') {
                newParams.set('tab', newValue);
            }
            return newParams;
        });
    };

    const defaultTabs: DisplayableTab[] = React.useMemo(() => {
        return Model.getSchema().softDeletes
            ? [{ label: t('Trashed'), value: 'trashed' }]
            : []
    }, [Model, t]);

    const tabs: DisplayableTab[] = useApplyReducers(
        app('cms'),
        `model${pascalCase(Model.getSchemaName())}Tabs`,
        defaultTabs
    ) as DisplayableTab[];

    if (tabs.length === 0) {
        return null;
    }

    return (
        <Box sx={{ maxWidth: { xs: 320, sm: 480 }, bgcolor: 'background.paper' }}>
            <MuiTabs
                value={tab}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label={`tabs for ${Model.singular()}`}
                allowScrollButtonsMobile
            >
                <Tab
                    label={t('All')}
                    value="all"
                />
                {tabs.map((tab) => (
                    <Tab
                        key={tab.value}
                        label={tab.label}
                        value={tab.value}
                    />
                ))}
            </MuiTabs>
        </Box>
    );
}


export default Tabs;
