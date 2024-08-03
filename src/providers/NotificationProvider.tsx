import React from 'react';
import NotificationContext from '../contexts/NotificationContext';
import { Notification } from '../types/Notifications';
import { NotificationProviderProps } from '../types/PropTypes';
import { collect } from '@luminix/core';
import { useCollection } from '@luminix/react';

import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/Close';


const notifications = collect([] as Notification[]);

const notify = (notification: string | Notification) => {
    notifications.push(
        typeof notification === 'string' 
            ? { message: notification } 
            : notification
    );
};

const dismiss = () => {
    return notifications.pull(0);
};

const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
    autoHideDuration = 6000,
    variant,
    anchorOrigin,
}) => {

    const [open, setOpen] = React.useState(false);    
    const notificationsState = useCollection(notifications);

    const [current, setCurrent] = React.useState<Notification>();

    const handleClose = (
        _event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
        
    };

    React.useEffect(() => {
        if (!open && notificationsState.isNotEmpty()) {
            const timeoutId = setTimeout(() => {
                setCurrent(dismiss() ?? undefined);
                setOpen(true);
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [open, notificationsState]);

    return (
        <NotificationContext.Provider value={{
            isOpen: open,
            notify,
            dismissNotification: handleClose,
            notifications: notificationsState.all(),
            current,
        }}>
            {children}
            <Snackbar 
                open={open && !!current}
                autoHideDuration={autoHideDuration}
                anchorOrigin={anchorOrigin}
                onClose={handleClose}
            >
                {current && (
                    <Alert
                        onClose={handleClose}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        severity={current.severity as any}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        variant={variant as any}
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
