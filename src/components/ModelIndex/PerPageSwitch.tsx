
import React from 'react';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { useSearchParams } from 'react-router-dom';

import useCurrentQuery from '../../hooks/useCurrentQuery';
import { app } from '@luminix/core';
import { useApplyReducers } from '@luminix/react';

const PerPageSwitch: React.FunctionComponent = () => {

    const {
        meta: {
            per_page: perPage = 15,
        } = {},
    } = useCurrentQuery();

    const [, setSearchParams] = useSearchParams();

    const handleChange = (event: SelectChangeEvent<number>) => {
        setSearchParams((params) => {
            const newParams = new URLSearchParams(params);
            newParams.set('per_page', event.target.value.toString());

            return newParams;
        });
    };

    // const options = app('cms').perPageOptions([15, 30, 50, 100]);
    const options = useApplyReducers(
        app('cms'),
        'perPageOptions',
        [15, 30, 75, 150]
    ) as number[];

    return (
        <Stack
            direction="row"
            alignItems="center"
            gap={1}
        >
            <Typography variant="caption">
                Rows per page:
            </Typography>
            <Select
                value={perPage}
                onChange={handleChange}
                size="small"
                variant="standard"
                sx={{
                    fontSize: (theme) => theme.typography.caption.fontSize,
                    '& .MuiSelect-select': {
                        py: 0.5
                    }
                }}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option}
                        value={option}
                        sx={{
                            fontSize: (theme) => theme.typography.caption.fontSize,
                            minHeight: 'unset',
                            lineHeight: 1,
                            py: 1.5
                        }}
                    >
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </Stack>
    );

};



export default PerPageSwitch;

