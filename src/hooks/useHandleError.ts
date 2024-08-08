import React from 'react';

import { createErrorCallback } from '../support/error';
import useNotify from './useNotify';


export default function useHandleError() {

    const notify = useNotify();

    return React.useCallback((error: unknown) => {
        createErrorCallback(notify)(error);
    }, [notify]);

}



