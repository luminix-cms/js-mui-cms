import React from 'react';
import { collect } from '@luminix/core';
import { useCollection } from '@luminix/react';

import {
    Snackbar,
    Alert,
    AlertTitle,
    Button,
    IconButton,
} from '@mui/material';

import { SnackbarCloseReason } from '@mui/material/Snackbar';

import { Close } from '@mui/icons-material';

import { useTheme } from '@mui/material/styles';

import useIsDesktopMode from '../../hooks/useIsDesktopMode';
import NotificationContext from '../../contexts/NotificationContext';
import { Notification, NotifyFunction } from '../../types/Notifications';
import { NotificationProviderProps } from '../../types/PropTypes';


type CurrentNotification = Notification & { id: number };

const notifications = collect([] as CurrentNotification[]);

let nextId = 0;

/**
 * Substitui a notificação atual. Apenas uma notificação existe por vez:
 * a mais recente sempre vence.
 */
const notify: NotifyFunction = (notification) => {
    const item = typeof notification === 'string'
        ? { message: notification }
        : notification;

    nextId += 1;

    notifications.splice(0, notifications.count(), { ...item, id: nextId });
};

const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
    autoHideDuration = 6000,
    variant,
    anchorOrigin,
    sx,
    ...props
}) => {

    const notificationsState = useCollection(notifications);

    const isDesktop = useIsDesktopMode();
    const theme = useTheme();

    const defaultDisplacement = theme.spacing(isDesktop ? 3 : 1);

    const [displacement, setDisplacement] = React.useState(defaultDisplacement);

    const { vertical = 'bottom' } = anchorOrigin || {};

    const current = notificationsState.first() ?? undefined;

    const handleClose = (
        _event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
          return;
        }

        notifications.splice(0, notifications.count());
    };

    /**
     * Fecha uma notificação específica. Nada acontece se ela já foi
     * substituída por uma mais recente.
     */
    const closeNotification = (id: number) => {
        if (notifications.first()?.id === id) {
            handleClose();
        }
    };

    return (
        <NotificationContext.Provider value={{
            isOpen: !!current,
            notify,
            dismissNotification: handleClose,
            notifications: notificationsState.all(),
            current,
            displacement,
            setDisplacement,
        }}>
            {children}
            <Snackbar
                // remonta o Snackbar em cada notificação, reiniciando o timer de auto hide
                key={current?.id}
                open={!!current}
                autoHideDuration={autoHideDuration}
                anchorOrigin={anchorOrigin}
                onClose={handleClose}
                sx={{
                    ...sx,
                    [vertical]: `${displacement} !important`,
                }}
                {...props}
            >
                {current && (
                    <Alert
                        onClose={handleClose}
                        severity={current.severity}
                        variant={variant}
                        sx={{ width: '100%' }}
                        action={current.actions && [
                            ...current.actions.map(({ label, callback }, index) => (
                                <Button
                                    key={index}
                                    color="inherit"
                                    size="small"
                                    onClick={() => callback({ close: () => closeNotification(current.id) })}
                                >
                                    {label}
                                </Button>
                            )),
                            <IconButton key="close" aria-label="close" color="inherit" size="small" onClick={handleClose}>
                                <Close />
                            </IconButton>
                        ]}
                    >
                        {current.title && (
                            <AlertTitle>
                                {current.title}
                            </AlertTitle>
                        )}
                        {current.message}
                        
                    </Alert>
                )}
                
            </Snackbar>
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
