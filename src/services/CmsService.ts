
import React from 'react';

import { Str, Reducible } from '@luminix/support';
import { model, ModelType } from '@luminix/core';
import { ModelFormProps } from '@luminix/react';

import { RouteObject } from 'react-router-dom';
import { MenuItem } from '../types/Menu';
import { StaticAction, MassAction } from '../types/Table';

export class CmsService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;

    private components: Record<string, React.ComponentType<any>> = {};

    booted() {
        this.components = this.componentMap({});
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getComponents(): Record<string, React.ComponentType<any>> {
        return this.components;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getComponent(name: string): React.ComponentType<any> {
        return this.getComponents()[name];
    }

    getRoutes(): RouteObject[]
    {
        return this.cmsRoutes([], this.getComponents(), model().make());
    }

    getMenuItems(): MenuItem[] {
        return this.menuItems([], model().make());
    }

    getModelFormProps(item: ModelType): ModelFormProps {
        return this.wireModelFormProps({}, item);
    }

    getMassActions(ModelClass: typeof ModelType, currentTab: string): MassAction[] {
        return this[`mass${Str.studly(ModelClass.getSchemaName())}Actions`](
            this.massActions([], ModelClass, currentTab),
            ModelClass,
            currentTab,
        );
    }

    getInstanceActions(ModelClass: typeof ModelType, currentTab: string): StaticAction[] {
        return this[`instance${Str.studly(ModelClass.getSchemaName())}Actions`](
            this.instanceActions([], ModelClass, currentTab),
            ModelClass,
            currentTab,
        );
    }

    getStaticActions(ModelClass: typeof ModelType, currentTab: string): StaticAction[] {
        return this[`static${Str.studly(ModelClass.getSchemaName())}Actions`](
            this.staticActions([], ModelClass, currentTab),
            ModelClass,
            currentTab,
        );
    }

}


export default Reducible(CmsService);
