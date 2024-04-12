import React from 'react';

import { useBrowsableQuery } from '@luminix/react';

import QueryContext from '../contexts/QueryContext';
import useSearch from '../hooks/useSearch';

import { QueryProviderProps } from '../types/PropTypes';


const QueryProvider: React.FunctionComponent<QueryProviderProps> = ({
    Model, children,
    scope = () => {},
    dependencies = [],
}) => {

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const query = React.useMemo(() => Model.where(scope), [Model, ...dependencies]);

    const {
        data: items,
        ...queryResults
    } = useBrowsableQuery(query);

    useSearch();

    return (
        <QueryContext.Provider
            value={{
                query,
                items,
                Model,
                ...queryResults,
            }}
        >
            {children}
        </QueryContext.Provider>
    );

};

export default QueryProvider;