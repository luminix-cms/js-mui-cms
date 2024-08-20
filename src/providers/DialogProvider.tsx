import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

import { DialogProps } from '@mui/material/Dialog';

import { DialogMessage } from '../types/Dialog';
import DialogContext from '../contexts/DialogContext';
import useOptimistic from '../hooks/useOptimistic';

type DialogProviderState = {
    current?: DialogMessage;
    resolve?: (value: boolean) => void;
};


function DialogProvider({ children, ...props }: Omit<DialogProps, 'open' | 'onClose'>): React.ReactNode {

    const [{ current, resolve }, setState] = React.useState<DialogProviderState>({});
    const optimisticCurrent = useOptimistic(current);

    const dialog = React.useCallback((message: string | DialogMessage) => {
        return new Promise<boolean>((resolve) => {
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
            resolve(true);
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
            >
                {optimisticCurrent?.title && <DialogTitle id="alert-dialog-title">{optimisticCurrent.title}</DialogTitle>}
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {optimisticCurrent?.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {'confirm' === optimisticCurrent?.type && (
                        <>
                            <Button onClick={handleClose}>
                                {optimisticCurrent?.cancelText ?? t('No')}
                            </Button>
                            <Button onClick={handleConfirm} autoFocus>
                                {optimisticCurrent?.confirmText ?? t('Yes')}
                            </Button>
                        </>
                    )}
                    {'alert' === (optimisticCurrent?.type ?? 'alert') && (
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
