
import React from 'react';

export type MenuItem = {
    key: string | number;
    text: string;
    icon?: React.ReactNode;
    // ListItemProps?: ListItemProps;
    // ListItemButtonProps?: ListItemButtonProps;
    component?: React.ComponentType;
    to?: string;
    onClick?: (e: React.MouseEvent) => void;


    children?: MenuItem[];
    element?: React.ReactNode;
    hidden?: () => boolean;
};

