
import React from 'react';

import { Str, Reducible } from '@luminix/support';
import { auth, model, ModelType } from '@luminix/core';
import { ModelFormProps } from '@luminix/react';

import { RouteObject } from 'react-router-dom';
import { MenuItem } from '../types/Menu';
import { StaticAction, MassAction, RowClickHandler } from '../types/Table';

export class CmsService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;

    private components: Record<string, React.ComponentType<any>> = {};
    private logoutCallback: (() => void) | null = null;

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

    logoutUsing(callback: () => void): void {
        this.logoutCallback = callback;
    }

    getLogoutCallback(): () => void {
        return this.logoutCallback ?? (() => auth().logout());
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

    getRowClickHandlers(ModelClass: typeof ModelType, item: ModelType): RowClickHandler[] {
        return this[`row${Str.studly(ModelClass.getSchemaName())}ClickHandlers`](
            this.rowClickHandlers([], ModelClass, item),
            ModelClass,
            item,
        );
    }

    onRowClick(callback: RowClickHandler, model?: string, priority?: number): () => void {
        return this.reducer(
            model ? `row${Str.studly(model)}ClickHandlers` : 'rowClickHandlers',
            (handlers: RowClickHandler[]) => [...handlers, callback],
            priority,
        );
    }

    clearRowClickHandlers(model?: string): void {
        if (!model) {
            this.clearReducer('rowClickHandlers');
            return;
        }

        // The default handler lives on the generic `rowClickHandlers` chain, whose result is the input of
        // the per-model chain. A priority 0 reducer returning an empty list therefore discards the generic
        // contribution for this model only, while later `onRowClick` registrations still append.
        const name = `row${Str.studly(model)}ClickHandlers`;

        this.clearReducer(name);
        this.reducer(name, () => [], 0);
    }

}


export default Reducible(CmsService);
