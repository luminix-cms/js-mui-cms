

export type NotificationAction = {
    label: string;
    callback: () => void;
};

export type Notification = {
    message: string;
    severity?: 'info' | 'success' | 'warning' | 'error' | string;
    actions?: NotificationAction[];


    
};