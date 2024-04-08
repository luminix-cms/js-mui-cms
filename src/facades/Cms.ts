
import React from 'react';

import { AppFacade, Reducible } from '@luminix/core';
import { RouteObject } from 'react-router-dom';
import { MenuItem } from '../types/Menu';


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

}


export default Reducible(CmsFacade);
