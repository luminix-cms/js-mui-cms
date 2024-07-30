/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';

import { app } from '@luminix/core';

import ModelFilterRowContext from '../../../contexts/ModelFilterRowContext';

import Box from '@mui/material/Box';

import AsyncAutocomplete from './ValueInput/AsyncAutocomplete';
// import Autocomplete from './ValueInput/Autocomplete';
import DatePicker from './ValueInput/DatePicker';
import Switch from './ValueInput/Switch';
import TextField from './ValueInput/TextField';

const ValueInput: React.FunctionComponent = () => {

    const FilterFacade = app('filter');

    const { type, operator } = React.useContext(ModelFilterRowContext);

    const doubleFields = React.useMemo(
        () => [ 'between', 'notBetween' ].includes(operator), 
        [ operator ]
    );

    if ([ 'null', 'notNull' ].includes(operator)) {
        return (
            <Box width={312} />
        );
    }

    if (doubleFields) {
        switch (FilterFacade.getInputType(type)) {
            case 'date': return (
                <>
                    <DatePicker index={0} />
                    <DatePicker index={1} />
                </>
            )
            //
            default: return (
                <>
                    <TextField index={0} />
                    <TextField index={1} />
                </>
            )
        }
    }

    switch (FilterFacade.getInputType(type)) {
        case 'date': return (
            <DatePicker />
        )
        case 'autocomplete': return (
            <AsyncAutocomplete />
        )
        case 'boolean': return (
            <Switch />
        )
        //
        default: return (
            <TextField />
        )
    }
}

export default ValueInput;