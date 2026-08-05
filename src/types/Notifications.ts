import { AlertProps } from "@mui/material";
import React from "react";


export type NotificationActionCallbackEvent = {
    /**
     * Fecha a notificação que originou a action. Não faz nada se ela já
     * foi substituída por uma notificação mais recente.
     */
    close: () => void;
};

export type NotificationAction = {
    label: React.ReactNode;
    callback: (e: NotificationActionCallbackEvent) => void;
};

export type Notification = {
    message: React.ReactNode;
    severity?: AlertProps['severity']; // 'info' | 'success' | 'warning' | 'error' | string;
    actions?: NotificationAction[];
    title?: React.ReactNode;
};

export type NotifyFunction = (notification: string | Notification) => void;