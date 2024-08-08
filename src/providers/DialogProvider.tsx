import React from 'react';

import DialogContext from '../contexts/DialogContext';
import { DialogMessage } from '../types/Dialog';

import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useOptimistic from '../hooks/useOptimistic';

type DialogProviderState = {
    current?: DialogMessage;
    resolve?: (value: boolean) => void;
};


function DialogProvider({ children, ...props }: Partial<DialogProps>): React.ReactNode {

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
                                {optimisticCurrent?.cancelText ?? 'No'}
                            </Button>
                            <Button onClick={handleConfirm} autoFocus>
                                {optimisticCurrent?.confirmText ?? 'Yes'}
                            </Button>
                        </>
                    )}
                    {'alert' === (optimisticCurrent?.type ?? 'alert') && (
                        <Button onClick={handleClose} autoFocus>
                            {optimisticCurrent?.confirmText ?? 'Ok'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </DialogContext.Provider>
    )
}


export default DialogProvider;
