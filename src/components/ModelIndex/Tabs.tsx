
import React from 'react';
import _ from 'lodash';

import MuiTabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useSearchParams } from 'react-router-dom';
import useCurrentModel from '../../hooks/useCurrentModel';
import { DisplayableTab } from '../../types/Tabs';
import { useApplyReducers } from '@luminix/react';
import { app } from '@luminix/core';

function Tabs(): React.ReactNode {

    const Model = useCurrentModel();

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
            ? [{ label: 'Trashed', value: 'trashed' }]
            : []
    }, [Model]);

    const tabs: DisplayableTab[] = useApplyReducers(
        app('cms'),
        `model${_.upperFirst(_.camelCase(Model.getSchemaName()))}Tabs`,
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
                    label="All"
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
