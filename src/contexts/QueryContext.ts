
import React from 'react';
import { QueryContextValue } from '../types/Contexts';
import { BuilderInterface } from '@luminix/core/dist/types/Builder';
import { Model } from '@luminix/core';
import { ModelPaginatedResponse } from '@luminix/core/dist/types/Model';

const QueryContext = React.createContext<QueryContextValue>({
    query: null as unknown as BuilderInterface<Model, ModelPaginatedResponse>,
    refresh: () => {},
    loading: false,
    error: new Error('Trying to access PaginateContext outside of PaginateProvider'),
    Model: null as unknown as typeof Model,
});

export default QueryContext;
