import React from 'react';

import useNotifications from './useNotifications';
import { createErrorCallback } from '../support/error';


export default function useHandleError() {

    const { notify } = useNotifications();

    return React.useCallback((error: unknown) => {
        createErrorCallback(notify)(error);
    }, [notify]);

}



