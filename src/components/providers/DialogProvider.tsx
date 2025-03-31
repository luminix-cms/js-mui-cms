import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogProps,
    DialogTitle,
    TextField,
} from '@mui/material';


import { DialogMessage } from '../../types/Dialog';
import DialogContext from '../../contexts/DialogContext';
import useOptimistic from '../../hooks/useOptimistic';

type DialogProviderState = {
    current?: DialogMessage;
    resolve?: (value: boolean|string) => void;
};


function DialogProvider({ children, ...props }: Omit<DialogProps, 'open' | 'onClose'>): React.ReactNode {

    const [{ current, resolve }, setState] = React.useState<DialogProviderState>({});
    const [value, setValue] = React.useState('');
    const optimisticCurrent = useOptimistic(current);

    const {
        type = 'alert', dialogProps = {}, textFieldProps = {},

    } = optimisticCurrent ?? {};

    const dialog = React.useCallback((message: string | DialogMessage) => {
        return new Promise<boolean|string>((resolve) => {
            if (typeof message !== 'string' && message.type === 'prompt') {
                setValue(message.defaultValue ?? '');
            }
            setState({
                current: typeof message === 'string' 
                    ? { message }
                    : message,
                resolve,
            });
        });
    }, []);

    const { t } = useTranslation();

    const handleClose = () => {
        if (resolve) {
            resolve(false);
        }
        setState({});
    };

    const handleConfirm = () => {
        if (resolve) {
            resolve(
                type === 'prompt'
                    ? value
                    : true
            );
        }
        setState({});
    };


    return (
        <DialogContext.Provider value={{
            isOpen: !!current,
            current,
            dialog,
            dismissDialog: handleClose,
        }}>
            {children}
            <Dialog
                open={!!current}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                {...(current?.dismissable ?? true 
                    ? { onClose: handleClose } 
                    : {})}
                {...props}
                {...dialogProps}
            >
                {optimisticCurrent?.title && <DialogTitle id="alert-dialog-title">{optimisticCurrent.title}</DialogTitle>}
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {optimisticCurrent?.message}
                    </DialogContentText>
                    {type === 'prompt' && (
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            type="text"
                            fullWidth
                            {...textFieldProps}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    {'alert' !== type && (
                        <>
                            <Button onClick={handleClose}>
                                {optimisticCurrent?.cancelText ?? t(type === 'confirm' ? 'No' : 'Cancel')}
                            </Button>
                            <Button onClick={handleConfirm} autoFocus={type !== 'prompt'}>
                                {optimisticCurrent?.confirmText ?? t(type === 'confirm' ? 'Yes' : 'Ok')}
                            </Button>
                        </>
                    )}
                    {'alert' === type && (
                        <Button onClick={handleClose} autoFocus>
                            {optimisticCurrent?.confirmText ?? t('Ok')}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </DialogContext.Provider>
    )
}


export default DialogProvider;
