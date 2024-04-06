import React from 'react';
import { ModelComponentProps } from '../types/PropTypes';

import { useParams } from 'react-router-dom';


const ModelItem: React.FunctionComponent<ModelComponentProps> = ({ Model }) => {

    const { id } = useParams();


    return (
        <div>
            <h1>{Model.singular()} #{id}</h1>
        </div>
    );
}

export default ModelItem;
