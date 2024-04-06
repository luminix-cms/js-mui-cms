
import React from 'react';

import { Reducible } from '@luminix/core';
import { ReducerCallback } from '@luminix/core/dist/types/Reducer';


class ComponentFacade {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;

    make(): Record<string, React.FunctionComponent>;
    make(component: string): React.FunctionComponent;
    make(component?: string) {
        const components = this.componentMap({});

        if (component) {
            return components[component];
        }

        return components;

    }


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reducer(_: string, __: ReducerCallback, ___ = 10) {
        throw new Error('Method not implemented.');
    }

}


export default Reducible(ComponentFacade);
