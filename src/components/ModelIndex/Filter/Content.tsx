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
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';

import AddCircleOutline from '@mui/icons-material/AddCircleOutline';

import Row from './Row';

import { FilterContent, FilteredColumn } from '../../../types/Filter';

const Content: React.FunctionComponent<FilterContent> = ({ dialog = false }) => {

    const { t } = useTranslation();

    const isDesktop = useIsDesktopMode();
    const breakpoint = useLayoutConfig('breakpoint', 'md') as Breakpoint;

    const FilterFacade = app('filter');

    const {
        columnsFilter, setColumnsFilter, 
        handleApplyFilters, 
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
                appended: false,
                nullable: false, 
                is_relation: false,
            }
        ]);
    };

    return (
        <Box 
            sx={{ 
                minWidth: { [breakpoint]: 567.5 }, 
                p: dialog ? 0 : 2,
            }}
        >
            <Stack>
                {columnsFilter.map((column, i, arr) => {

                    const isLast = i == arr.length - 1;

                    return (
                        <>
                            <Row
                                key={`row_${column.key}`}
                                index={i}
                                column={column}
                            />
                            
                            {!isDesktop && (
                                <Divider sx={{ 
                                    mt: isLast ? .625 : 1.25, 
                                    mb: isLast ? .75 : 1.5, 
                                    ...(isLast) && {
                                        border: 'none'
                                    }
                                }} />
                            )}
                        </>
                    );
                })}
            </Stack>

            <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
            >
                {isDesktop
                    ? (
                        <Button
                            variant="outlined"
                            onClick={handleAddColumn}
                            fullWidth
                            sx={{ mt: 0.75 }}
                        >
                            {`+ ${t('Add Column')}`}
                        </Button>
                    )
                    : (
                        <IconButton
                            onClick={handleAddColumn}
                            color="primary"
                            sx={{ fontSize: 32 }}
                        >
                            <AddCircleOutline fontSize="inherit" />
                        </IconButton>
                    )
                }
            </Stack>

            {isDesktop && (
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
            )}     
        </Box>
    )
}

export default Content;