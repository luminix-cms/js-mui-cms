import React from 'react';
import { NotificationContextValue } from '../types/Contexts';

const NotificationContext = React.createContext<NotificationContextValue>({
    isOpen: false,
    create: () => {},
    close: () => {},
    notifications: [],
    current: undefined,
});

export default NotificationContext;
