
import React from 'react';

import { Reducible } from '@luminix/core';
import { ReducerCallback } from '@luminix/core/dist/types/Reducer';

import App from '../views/Layout/App';
import Dashboard from '../views/Dashboard';

class ComponentFacade {

    constructor(

    ) {

    }

    [key: string]: any;


    boot() {

        this.reducer('componentMap', () => ({
            Layout: App,
            Dashboard: Dashboard,
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


    reducer(_: string, __: ReducerCallback, ___ = 10) {
        throw new Error('Method not implemented.');
    }

}


export default Reducible(ComponentFacade);
