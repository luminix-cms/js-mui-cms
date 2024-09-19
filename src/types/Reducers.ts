import { ModelType as Model } from '@luminix/core';
import { RouteObject } from 'react-router-dom';

export type ComponentMapReducer = (components: Record<string, React.FunctionComponent>) => Record<string, React.FunctionComponent>;

export type CmsRoutesReducer = (
    routes: RouteObject[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    components: Record<string, React.FunctionComponent<any>>,
    models: Record<string, typeof Model>,
) => RouteObject[];




