/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';

import { app } from '@luminix/core';

import ModelFilterContext from '../../../contexts/ModelFilterContext';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Row from './Row';

import { FilteredColumn } from '../../../types/Filter';

import { translateColumnsToQuery } from '../../../support/ModelIndex/Filter/searchParams';

const Content: React.FunctionComponent = () => {

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
            sx={{ minWidth: 567.5 }}
            p={2} 
        >
            <Stack>
                {columnsFilter.map((column, index) => (
                    <Row
                        key={`row_${column.key}`}
                        index={index}
                        column={column}
                    />
                ))}
            </Stack>

            <Stack mt={0.75} >
                <Button
                    variant="outlined"
                    onClick={handleAddColumn}
                    fullWidth
                >
                    + Add Column
                </Button>
            </Stack>

            <Stack
                direction="row"
                justifyContent="space-between"
                mt={2}
            >
                <Button onClick={clearFilters} >
                    Clear
                </Button>

                <Button
                    variant="contained"
                    onClick={handleApplyFilters}
                    disabled={FilterFacade.checkIfCanApplyFilters(columnsFilter)}
                >
                    Apply
                </Button>
            </Stack>
        </Box>
    )
}

export default Content;