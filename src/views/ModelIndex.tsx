import React from 'react';
import { ModelComponentProps } from '../types/PropTypes';
import { useBrowsableQuery } from '@luminix/react';
import { app, log } from '@luminix/core';
import ModelIndexSkeleton from './ModelIndex.skeleton';
import useSetPageTitle from '../hooks/useSetPageTitle';
import useSearch from '../hooks/useSearch';

const ModelIndex: React.FunctionComponent<ModelComponentProps> = ({ Model }) => {

    const query = React.useMemo(() => {
        const query = Model.query();
        log().info('ModelIndex: query', { Model, query });
        return query;
    }, [Model]);

    const {
        data: items,
        loading,
        error,
        // links,
    } = useBrowsableQuery(query);

    useSetPageTitle(Model.plural());

    useSearch();

    const { Error, DesktopPageTitle } = app('cms').getComponents();

    if (error) {
        return <Error error={error} />;
    }

    if (loading) {
        return <ModelIndexSkeleton />;
    }


    return (
        <>
            <DesktopPageTitle />
            <ul>
                {items!.map((item, index) => (
                    <li key={index}>
                        <a href={`/${Model.plural()}/${item.id}`}>{item.id}</a>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default ModelIndex;

