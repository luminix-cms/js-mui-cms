import React from 'react';
import { NotificationContextValue } from '../types/Contexts';

const NotificationContext = React.createContext<NotificationContextValue>({
    isOpen: false,
    notify: () => {},
    dismissNotification: () => {},
    notifications: [],
    current: undefined,
    displacement: '8px',
    setDisplacement: () => {},
});

export default NotificationContext;
