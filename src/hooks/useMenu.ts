import React from 'react';
import { LayoutContext } from '../providers/LayoutProvider';

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




