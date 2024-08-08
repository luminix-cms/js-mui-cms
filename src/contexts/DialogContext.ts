import React from 'react';
import { DialogContextValue } from '../types/Contexts';


const DialogContext = React.createContext<DialogContextValue>({
    isOpen: false,
    dialog: () => Promise.reject(new Error('Trying to access DialogContext outside of DialogProvider')),
    dismissDialog: () => {},
    current: undefined,
});

export default DialogContext;
