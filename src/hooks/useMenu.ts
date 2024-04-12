import React from 'react';
import LayoutContext from '../contexts/LayoutContext';

/**
 * 
 * Hook to control the menu state.
 * 
 * @returns {object} An object containing the open state and functions to open, close, and toggle the menu.
 */
export default function useMenu() {
    const { open, setOpen } = React.useContext(LayoutContext);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const toggle = () => {
        setOpen((prev) => !prev);
    };

    return {
        open,
        handleDrawerOpen,
        handleDrawerClose,
        toggle,
    };
}




