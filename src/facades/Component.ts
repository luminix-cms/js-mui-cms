
import React from 'react';

import { Reducible } from '@luminix/core';
import { ReducerCallback } from '@luminix/core/dist/types/Reducer';

import Layout from '../views/Layout/Layout';
import Dashboard from '../views/Dashboard';
import ModelIndex from '../views/ModelIndex';
import ModelItem from '../views/ModelItem';

class ComponentFacade {

    constructor(

    ) {

    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;


    boot() {

        this.reducer('componentMap', () => ({
            Layout,
            Dashboard,
            ModelIndex,
            ModelItem,
        }), 0);

    }

    make(): Record<string, React.FunctionComponent>;
    make(component: string): React.FunctionComponent;
    make(component?: string) {
        if (typeof this.componentMap !== 'function') {
            throw new Error('Expect ComponentFacade to be Reducible');
        }

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
