/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { useTranslation } from 'react-i18next';

import { app } from '@luminix/core';

import useIsDesktopMode from '../../../hooks/useIsDesktopMode';
import useLayoutConfig from '../../../hooks/useLayoutConfig';

import ModelFilterContext from '../../../contexts/ModelFilterContext';

import { Breakpoint } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import Row from './Row';


import { FilteredColumn } from '../../../types/Filter';

import { translateColumnsToQuery } from '../../../support/ModelIndex/Filter/searchParams';

const Content: React.FunctionComponent = () => {

    const { t } = useTranslation();

    const isDesktop = useIsDesktopMode();
    const breakpoint = useLayoutConfig('breakpoint', 'md') as Breakpoint;

    const FilterFacade = app('filter');

    const {
        columnsFilter, setColumnsFilter, 
        setSearchParams,
        clearSearchParams,
        clearFilters,
    } = React.useContext(ModelFilterContext);

    const handleAddColumn = () => {
        setColumnsFilter((prev: FilteredColumn[]) => [
            ...prev, 
            { 
                key: '', 
                operator: 'equals', 
                type: 'text', 
                value: '', 
                is_relation: false,
            }
        ]);
    };

    const handleApplyFilters = () => {
        clearSearchParams();

        const searchParams = translateColumnsToQuery(columnsFilter);

        setSearchParams(searchParams, { replace: true });
    };

    return (
        <Box 
            sx={{ minWidth: { [breakpoint]: 567.5 } }}
            p={2} 
        >
            <Stack>
                {columnsFilter.map((column, index) => (
                    <>
                        <Row
                            key={`row_${column.key}`}
                            index={index}
                            column={column}
                        />
                        
                        {!isDesktop && (
                            <Divider sx={{ 
                                mt: 1.25, 
                                mb: 1.5, 
                            }} />
                        )}
                    </>
                ))}
            </Stack>

            <Stack mt={0.75} >
                <Button
                    variant="outlined"
                    onClick={handleAddColumn}
                    fullWidth
                >
                    {`+ ${t('Add Column')}`}
                </Button>
            </Stack>

            <Stack
                direction="row"
                justifyContent="space-between"
                mt={2}
            >
                <Button onClick={clearFilters} >
                    {t('Clear')}
                </Button>

                <Button
                    variant="contained"
                    onClick={handleApplyFilters}
                    disabled={FilterFacade.checkIfCanApplyFilters(columnsFilter)}
                >
                    {t('Apply')}
                </Button>
            </Stack>
        </Box>
    )
}

export default Content;