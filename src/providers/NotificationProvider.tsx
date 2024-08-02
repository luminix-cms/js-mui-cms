import React from 'react';
import NotificationContext from '../contexts/NotificationContext';
import { Notification } from '../types/Notifications';
import { NotificationProviderProps } from '../types/PropTypes';
import { collect } from '@luminix/core';
import { useCollection } from '@luminix/react';

import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


const notifications = collect([] as Notification[]);

const createNotification = (notification: Notification) => {
    notifications.push(notification);
};

const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
    autoHideDuration = 6000,
    variant,
    anchorOrigin,
}) => {

    const [open, setOpen] = React.useState(false);    
    const notificationsState = useCollection(notifications);

    const current = notificationsState.first() ?? undefined;

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
      ) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
    };

    React.useEffect(() => {
        if (!open && notificationsState.isNotEmpty()) {
            notifications.pull(0);
            setOpen(true);
        }
    }, [open, notificationsState]);




    return (
        <NotificationContext.Provider value={{
            isOpen: open,
            create: createNotification,
            close,
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
                    >
                        {current.message}
                    </Alert>
                )}
                
            </Snackbar>
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
