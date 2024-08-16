/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { useTranslation } from 'react-i18next';

import { app } from '@luminix/core';

import useIsDesktopMode from '../../../../hooks/useIsDesktopMode';

import ModelFilterRowContext from '../../../../contexts/ModelFilterRowContext';

import MuiTextField from '@mui/material/TextField';

import { FilterValueInput } from '../../../../types/Filter';

const TextField: React.FunctionComponent<FilterValueInput> = ({ index = null }) => {

    const { t } = useTranslation();

    const isDesktop = useIsDesktopMode();

    const FilterFacade = app('filter');

    const {
        type, 
        value, setValue, 
    } = React.useContext(ModelFilterRowContext);

    const inputLabel = index !== null
        ? `${t('Value')} ${index + 1}`
        : `${t('Value')}`;

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
            value={inputValue || ''}
            onChange={handleValue}
            sx={{ width: isDesktop ? 167.5 : '100%' }}
            size="small"
        />
    );
};

export default TextField;