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

    return {
        open,
        handleDrawerOpen,
        handleDrawerClose,
    };
}




