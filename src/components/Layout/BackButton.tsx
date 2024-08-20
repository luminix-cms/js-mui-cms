import React from 'react';
import { Link } from 'react-router-dom';

import { IconButton } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';

import { IconButtonProps } from '@mui/material/IconButton';



function BackButton(props: IconButtonProps): React.ReactNode {

    return (
        <IconButton
            component={Link}
            to={-1 as unknown as string}
            edge="start"
            color="inherit"
            aria-label="back"
            {...props}
        >
            <ChevronLeftIcon />
        </IconButton>
    );

}


export default BackButton;