import React from 'react';

import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Link } from 'react-router-dom';



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