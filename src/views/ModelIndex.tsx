import React from 'react';
import { ModelComponentProps } from '../types/PropTypes';
import { useBrowsableQuery } from '@luminix/react';
import { app, log } from '@luminix/core';
import ModelIndexSkeleton from './ModelIndex.skeleton';

const ModelIndex: React.FunctionComponent<ModelComponentProps> = ({ Model }) => {

    const query = React.useMemo(() => Model.query(), [Model]);

    const {
        data: items,
        loading,
        error,
        ...paginator
    } = useBrowsableQuery(query);

    log(paginator);

    const Error = app('cms').getComponent('Error');

    if (error) {
        return <Error error={error} />;
    }

    if (loading) {
        return <ModelIndexSkeleton />;
    }


    return (
        <div>
            <h1>{Model.plural()}</h1>
            <ul>
                {items!.map((item, index) => (
                    <li key={index}>
                        <a href={`/${Model.plural()}/${item.id}`}>{item.id}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ModelIndex;

