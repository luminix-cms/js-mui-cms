/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';

import { app } from '@luminix/core';

import ModelFilterRowContext from '../../../contexts/ModelFilterRowContext';

import useRow from './useRow';

import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import HighlightOffOutlined from '@mui/icons-material/HighlightOffOutlined';

import ValueInput from './ValueInput';

import { InputOption } from '../../../types/PropTypes';
import { FilterRow } from "../../../types/Filter";

const Row: React.FunctionComponent<FilterRow> = ({ index, column }) => {

    const FilterFacade = app('filter');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const OPERATORS = React.useMemo(() => FilterFacade.getMatchingOperators(column), [column]);

    const {
        columns, 
        key, setKey,
        operator, setOperator,
        type, setType,
        value, setValue,
        isRelation, setIsRelation,
        handleKey,
        handleOperator,
        handleRemoveColumn,
    } = useRow( index, column );

    return (
        <ModelFilterRowContext.Provider
            value={{
                key, setKey, 
                type, setType, 
                operator, setOperator, 
                value, setValue, 
                isRelation, setIsRelation, 
            }}
        >
            <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                gap={0.5}
            >
                <Stack
                    key={`filter_${key}_${index}`}
                    direction="row" 
                    alignItems="center" 
                    my={1}
                    gap={1.5}
                >
                    <Select
                        label="Column"
                        size="small"
                        value={key}
                        onChange={handleKey}
                        sx={{ width: 165 }}
                    >
                        {columns.map(({ key, label }) => (
                            <MenuItem
                                key={`column_${key}_option`}
                                value={key}
                            >
                                {label}
                            </MenuItem>
                        ))}
                    </Select>

                    {(!isRelation && ![ 'boolean' ].includes(FilterFacade.getInputType(type))) && (
                        <Select
                            label="Operator"
                            size="small"
                            value={operator}
                            onChange={handleOperator}
                            sx={{ width: 135 }}
                        >
                            {OPERATORS.map(({ key, label }: InputOption) => (
                                <MenuItem
                                    key={`operator_${key}_option`}
                                    value={key}
                                >
                                    {label}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                    
                    <ValueInput />
                </Stack>

                <Stack>
                    <IconButton
                        color="error"
                        onClick={handleRemoveColumn(index)}
                    >
                        <HighlightOffOutlined />
                    </IconButton>
                </Stack>
            </Grid>
        </ModelFilterRowContext.Provider>
    )
}

export default Row;