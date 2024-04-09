import React from 'react';
import { ErrorProps } from '../types/PropTypes';
import { config } from '@luminix/core';

const Error: React.FunctionComponent<ErrorProps> = ({ error }) => {

    return (
        <div>
            <h1>Error</h1>
            <p>Something went wrong</p>
            {config('app.debug') && error && (
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





