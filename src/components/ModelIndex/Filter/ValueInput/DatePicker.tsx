/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';

import ModelFilterRowContext from '../../../../contexts/ModelFilterRowContext';

import { TextField } from '@mui/material';

import { FilterValueInput } from '../../../../types/Filter';

const DatePicker: React.FunctionComponent<FilterValueInput> = ({ index = null }) => {

    const { value, setValue } = React.useContext(ModelFilterRowContext);

    const inputLabel = index !== null
        ? `Date ${index + 1}`
        : 'Date';

    const inputValue = React.useMemo(
        () => index !== null ? value[index] : value, 
        [ value ]
    );

    const handleValue = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (typeof index === 'number') {
            setValue((prev: any) => {
                const newValue = prev;
                newValue[index] = event.target.value;
                return [ ...newValue ];
            });
        } else {
            setValue(event.target.value);
        }
    };

    return (
        <TextField 
            label={inputLabel}
            value={inputValue}
            onChange={handleValue}
            type="date"
            size="small"
            sx={{ minWidth: 230 }}
        />
    );
};

export default DatePicker;