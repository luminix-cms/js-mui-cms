/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';

import useIsDesktopMode from '../../../../hooks/useIsDesktopMode';

import ModelFilterRowContext from '../../../../contexts/ModelFilterRowContext';

import Box from '@mui/material/Box';
import MuiSwitch from '@mui/material/Switch';

const Switch: React.FunctionComponent = () => {
    
    const isDesktop = useIsDesktopMode();

    const { value, setValue } = React.useContext(ModelFilterRowContext);

    const handleValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue: any = event.target.checked;
        setValue(newValue ? 1 : 0);
    };

    return (
        <>
            <MuiSwitch
                checked={value}
                onChange={handleValue}
                inputProps={{ 'aria-label': 'filter-controlled' }}
                size="small"
            />
            
            {isDesktop && (
                <Box width={325} />
            )}
        </>
    );
};

export default Switch;