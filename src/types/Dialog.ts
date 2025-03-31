import { DialogProps, TextFieldProps } from "@mui/material";

export type DialogMessage = {

    title?: React.ReactNode,
    message: React.ReactNode,
    type?: 'alert' | 'confirm' | 'prompt',
    dismissable?: boolean,
    confirmText?: string,
    cancelText?: string,
    defaultValue?: string,
    dialogProps?: DialogProps,
    textFieldProps?: TextFieldProps,

};

export type DialogFunction = (message: string | DialogMessage) => Promise<boolean|string>;



