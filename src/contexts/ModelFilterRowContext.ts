
import React from 'react';

import { ModelFilterRowContextValue } from '../types/Contexts';

const ModelFilterRowContext = React.createContext<ModelFilterRowContextValue>({
    key: '', 
    type: '', 
    operator: '', 
    value: '', 
    isRelation: false, 
    //
    setKey: () => {}, 
    setType: () => {}, 
    setOperator: () => {}, 
    setValue: () => {}, 
    setIsRelation: () => {}, 
});

export default ModelFilterRowContext;