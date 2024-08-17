import { AlertProps } from "@mui/material";
import React from "react";


export type NotificationAction = {
    label: React.ReactNode;
    callback: () => void;
};

export type Notification = {
    message: React.ReactNode;
    severity?: AlertProps['severity']; // 'info' | 'success' | 'warning' | 'error' | string;
    actions?: NotificationAction[];
    title?: React.ReactNode;
};

export type NotifyFunction = (notification: string | Notification) => void;