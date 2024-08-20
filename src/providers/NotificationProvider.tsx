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

import Close from '@mui/icons-material/Close';

import { useTheme } from '@mui/material/styles';

import useIsDesktopMode from '../hooks/useIsDesktopMode';
import NotificationContext from '../contexts/NotificationContext';
import { Notification } from '../types/Notifications';
import { NotificationProviderProps } from '../types/PropTypes';


const notifications = collect([] as Notification[]);

const notify = (notification: string | Notification) => {
    notifications.push(
        typeof notification === 'string' 
            ? { message: notification } 
            : notification
    );
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

    const [current, setCurrent] = React.useState<Notification>();
    const [displacement, setDisplacement] = React.useState(defaultDisplacement);

    const { vertical = 'bottom' } = anchorOrigin || {};

    const handleClose = (
        _event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setCurrent(undefined);
        
    };

    React.useEffect(() => {
        if (!current && notificationsState.isNotEmpty()) {
            const timeoutId = setTimeout(() => {
                setCurrent(notifications.pull(0) ?? undefined);
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [current, notificationsState]);

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
                                    onClick={callback}
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
