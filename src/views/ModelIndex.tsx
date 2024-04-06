import React from 'react';
import { ModelComponentProps } from '../types/PropTypes';

const ModelIndex: React.FunctionComponent<ModelComponentProps> = ({ Model }) => {
    return (
        <div>
            <h1>{Model.plural()}</h1>
        </div>
    );
}

export default ModelIndex;

