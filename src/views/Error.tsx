import React from 'react';
import { ErrorProps } from '../types/PropTypes';
import { app } from '@luminix/core';

const Error: React.FunctionComponent<ErrorProps> = ({ error }) => {

    return (
        <div>
            <h1>Ops...</h1>
            <p>Something went wrong</p>
            {app().hasDebugModeEnabled() && error && (
                <>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>
                        {error.message}
                        <br />
                        {error.stack}
                    </pre>
                </>
            )}
        </div>
    );
};

export default Error;





