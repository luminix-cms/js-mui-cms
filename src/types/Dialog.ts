
export type DialogMessage = {

    title?: React.ReactNode,
    message: React.ReactNode,
    type?: 'alert' | 'confirm' | 'prompt',
    dismissable?: boolean,
    confirmText?: string,
    cancelText?: string,
    defaultValue?: string,


};

export type DialogFunction = (message: string | DialogMessage) => Promise<boolean|string>;



