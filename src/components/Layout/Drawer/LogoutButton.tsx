import React from 'react';
import { app } from '@luminix/core';
import { Logout as LogoutIcon } from '@mui/icons-material';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Tooltip,
} from '@mui/material';

import { LogoutButtonProps } from '../../../types/PropTypes';
import { useTranslation } from 'react-i18next';


const LogoutButton: React.FunctionComponent<LogoutButtonProps> = ({ collapsed = false }) => {

    const handleClick = app('cms').getLogoutCallback();

    const { t } = useTranslation();

    const button = (
        <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
                onClick={handleClick}
                sx={{
                    minHeight: 48,
                    justifyContent: collapsed ? 'center' : 'initial',
                    px: 2.5,
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: collapsed ? 'auto' : 3,
                        justifyContent: 'center',
                    }}
                >
                    <LogoutIcon />
                </ListItemIcon>
                {!collapsed && <ListItemText primary={t('Logout')} />}
            </ListItemButton>
        </ListItem>
    );

    return (
        <>
            <Divider />
            <List disablePadding>
                {collapsed
                    ? <Tooltip title={t('Logout')} placement="right">{button}</Tooltip>
                    : button
                }
            </List>
        </>
    );
};

export default LogoutButton;
