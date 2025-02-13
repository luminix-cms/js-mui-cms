/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { useTranslation } from 'react-i18next';

import { app } from '@luminix/core';

import useIsDesktopMode from '../../../../hooks/useIsDesktopMode';

import ModelFilterRowContext from '../../../../contexts/ModelFilterRowContext';

import { TextField } from '@mui/material';

import { FilterValueInput } from '../../../../types/Filter';
import { DateTime } from '@luminix/support';

const DatePicker: React.FunctionComponent<FilterValueInput> = ({ index = null }) => {

    const { t } = useTranslation();

    const isDesktop = useIsDesktopMode();

    const FilterFacade = app('filter');

    const { 
        type, 
        value, setValue, 
    } = React.useContext(ModelFilterRowContext);

    const hasTime = FilterFacade.getInputType(type) === 'datetime-local';

    const width = hasTime ? 230 : 167.5;

    /* * */

    const inputLabel = index !== null
        ? `${t('Date')} ${index + 1}`
        : `${t('Date')}`;

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
            type={FilterFacade.getInputType(type)}
            label={inputLabel}
            value={DateTime.toDateTimeLocal(DateTime.parse(inputValue))}
            onChange={handleValue}
            size="small"
            sx={{ width: isDesktop ? width : '100%' }}
        />
    );
};

export default DatePicker;