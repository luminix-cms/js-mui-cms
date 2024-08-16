/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';

import { app } from '@luminix/core';

import useIsDesktopMode from '../../../hooks/useIsDesktopMode';

import ModelFilterRowContext from '../../../contexts/ModelFilterRowContext';

import Box from '@mui/material/Box';

import AsyncAutocomplete from './ValueInput/AsyncAutocomplete';
// import Autocomplete from './ValueInput/Autocomplete';
import DatePicker from './ValueInput/DatePicker';
import Switch from './ValueInput/Switch';
import TextField from './ValueInput/TextField';

const ValueInput: React.FunctionComponent = () => {

    const isDesktop = useIsDesktopMode();

    const FilterFacade = app('filter');

    const { type, operator } = React.useContext(ModelFilterRowContext);

    const doubleFields = React.useMemo(
        () => [ 'between', 'notBetween' ].includes(operator), 
        [ operator ]
    );

    if ([ 'null', 'notNull' ].includes(operator)) {
        if (!isDesktop) {
            return null;
        }

        return (
            <Box width={230} />
        );
    }

    if (doubleFields) {
        switch (FilterFacade.getInputType(type)) {
            case 'date':
            case 'datetime-local': return (
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
        case 'date':
        case 'datetime-local': return (
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