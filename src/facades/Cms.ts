
import React from 'react';

import { AppFacade, Model, Reducible } from '@luminix/core';
import { RouteObject } from 'react-router-dom';
import { MenuItem } from '../types/Menu';
import { ModelFormProps } from '@luminix/react/dist/types/Form';
import { MassAction } from '../types/Table';

import _ from 'lodash';


class CmsFacade {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;

    
    constructor(
        private app: AppFacade
    ) {

    }

    getComponents(): Record<string, React.ComponentType> {
        return this.componentMap({});
    }

    getComponent(name: string): React.ComponentType {
        return this.getComponents()[name];
    }

    getRoutes(): RouteObject[]
    {
        return this.cmsRoutes([], this.getComponents(), this.app.make('model').make());
    }

    getMenuItems(): MenuItem[] {
        return this.menuItems([], this.app.make('model').make());
    }

    getModelFormProps(item: Model): ModelFormProps {
        return this.wireModelFormProps({}, item);
    }

    getMassActions(ModelClass: typeof Model, currentTab: string): MassAction[] {
        //console.log('getting mass actions for ', _.upperFirst(_.camelCase(ModelClass.getSchemaName())));

        return this[`mass${_.upperFirst(_.camelCase(ModelClass.getSchemaName()))}Actions`](
            this.massActions([], ModelClass, currentTab),
            ModelClass,
            currentTab,
        );
    }

}


export default Reducible(CmsFacade);
