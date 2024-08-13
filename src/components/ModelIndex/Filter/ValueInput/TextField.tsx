/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';

import { app } from '@luminix/core';

import ModelFilterRowContext from '../../../../contexts/ModelFilterRowContext';

import MuiTextField from '@mui/material/TextField';

import { FilterValueInput } from '../../../../types/Filter';

const TextField: React.FunctionComponent<FilterValueInput> = ({ index = null }) => {

    const FilterFacade = app('filter');

    const {
        type, 
        value, setValue, 
    } = React.useContext(ModelFilterRowContext);

    const inputLabel = index !== null
        ? `Value ${index + 1}`
        : 'Value';

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
        <MuiTextField
            type={FilterFacade.getInputType(type)}
            label={inputLabel}
            value={inputValue}
            onChange={handleValue}
            size="small"
        />
    );
};

export default TextField;