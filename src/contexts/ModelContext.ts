
import React from 'react';
import { ModelContextValue } from '../types/Contexts';
import { ModelType as Model } from '@luminix/core';


const ModelContext = React.createContext<ModelContextValue>({
    Model: null as unknown as typeof Model,
});


export default ModelContext;
