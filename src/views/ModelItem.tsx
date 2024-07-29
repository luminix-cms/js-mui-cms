import React from 'react';

import { useParams } from 'react-router-dom';
import useCurrentModel from '../hooks/useCurrentModel';


const ModelItem: React.FunctionComponent = () => {

    const { id } = useParams();

    const Model = useCurrentModel();

    return (
        <div>
            <h1>{Model.singular()} #{id}</h1>
        </div>
    );
}

export default ModelItem;
