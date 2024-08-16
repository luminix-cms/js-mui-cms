/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { useTranslation } from 'react-i18next';

import { app } from '@luminix/core';

import useLayoutConfig from '../../../hooks/useLayoutConfig';
import useIsDesktopMode from '../../../hooks/useIsDesktopMode';

import ModelFilterRowContext from '../../../contexts/ModelFilterRowContext';

import useRow from './useRow';

import { Breakpoint } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import HighlightOffOutlined from '@mui/icons-material/HighlightOffOutlined';

import ValueInput from './ValueInput';

import { InputOption } from '../../../types/PropTypes';
import { FilterRow } from "../../../types/Filter";

const Row: React.FunctionComponent<FilterRow> = ({ index, column }) => {

    const { t } = useTranslation();

    const isDesktop = useIsDesktopMode();
    const breakpoint = useLayoutConfig('breakpoint', 'md') as Breakpoint;

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

    const isBoolean = [ 'boolean' ].includes(FilterFacade.getInputType(type));

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
                display="flex"
                flexDirection={{ 
                    xs: 'column',
                    [breakpoint]: 'row', 
                }}
                flexWrap={{
                    xs: 'wrap',
                    [breakpoint]: 'nowrap',
                }}
                alignItems="center"
                justifyContent="space-between"
                gap={0.5}
            >
                <Stack
                    key={`filter_${key}_${index}`}
                    display="flex"
                    flexDirection={{ 
                        xs: 'column',
                        [breakpoint]: 'row', 
                    }}
                    alignItems="center" 
                    width="100%"
                    my={1}
                    gap={1.5}
                >
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        {...!isDesktop && { width: '100%' }}
                        gap={1}
                    >
                        <FormControl sx={{
                            width: !isDesktop 
                                ? `calc(100% - ${isBoolean ? 88 : 44}px)` 
                                : 165,
                        }} >
                            <InputLabel 
                                id="filter-column-select-label" 
                                size="small" 
                            >
                                {t('Column')}
                            </InputLabel>
                            <Select
                                labelId="filter-column-select-label"
                                id="filter-column-select"
                                value={key}
                                onChange={handleKey}
                                size="small"
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
                        </FormControl>

                        {!isDesktop && (
                            <Stack 
                                direction="row" 
                                alignItems="center"
                            >
                                {isBoolean && (
                                    <ValueInput />
                                )}
                                
                                <IconButton
                                    color="error"
                                    onClick={handleRemoveColumn(index)}
                                >
                                    <HighlightOffOutlined />
                                </IconButton>
                            </Stack>
                        )}
                    </Stack>

                    {(!isRelation && !isBoolean) && (
                        <FormControl sx={{
                            width: !isDesktop 
                                ? '100%' 
                                : 135,
                        }}  >
                            <InputLabel 
                                id="filter-operator-select-label"
                                size="small" 
                            >
                                {t('Operator')}
                            </InputLabel>
                            <Select
                                labelId="filter-operator-select-label"
                                id="filter-operator-select"
                                value={operator}
                                onChange={handleOperator}
                                size="small"
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
                        </FormControl>
                    )}
                    
                    {!isDesktop
                        ? !isBoolean && (
                            <ValueInput />
                        )
                        : (
                            <ValueInput />
                        )
                    }
                </Stack>
                
                {isDesktop && (
                    <IconButton
                        color="error"
                        onClick={handleRemoveColumn(index)}
                    >
                        <HighlightOffOutlined />
                    </IconButton>
                )}
            </Grid>
        </ModelFilterRowContext.Provider>
    )
}

export default Row;