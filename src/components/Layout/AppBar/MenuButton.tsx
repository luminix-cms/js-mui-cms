import React from 'react';

import { IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

import useMenu from '../../../hooks/useMenu';

const MenuButton: React.FunctionComponent = () => {
    const { handleDrawerOpen } = useMenu();

    return (
        <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerOpen}
            sx={{ mr: { md: 2 } }}
        >
            <MenuIcon />
        </IconButton>
    );
};

export default MenuButton;




