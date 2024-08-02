import React from 'react';
import { NotificationContextValue } from '../types/Contexts';

const NotificationContext = React.createContext<NotificationContextValue>({
    isOpen: false,
    notify: () => {},
    dismissNotification: () => {},
    notifications: [],
    current: undefined,
});

export default NotificationContext;
