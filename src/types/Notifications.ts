import React from "react";


export type NotificationAction = {
    label: React.ReactNode;
    callback: () => void;
};

export type Notification = {
    message: React.ReactNode;
    severity?: 'info' | 'success' | 'warning' | 'error' | string;
    actions?: NotificationAction[];
    title?: React.ReactNode;

    
};