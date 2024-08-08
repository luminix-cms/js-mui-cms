
export type DialogMessage = {

    title?: React.ReactNode,
    message: React.ReactNode,
    type?: 'alert' | 'confirm',
    dismissable?: boolean,
    confirmText?: string,
    cancelText?: string,


};

export type DialogFunction = (message: string | DialogMessage) => Promise<boolean>;



