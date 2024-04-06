// import React from 'react';

import { AppFacade, Reducible } from '@luminix/core';
import { ReducerCallback } from '@luminix/core/dist/types/Reducer';
import { Outlet } from 'react-router-dom';
import { CmsRoutesReducer } from '../types/Reducers';

import _ from 'lodash';

class RouteFacade {

    constructor(
        private app: AppFacade
    ) {

    }

    boot() {

        const routes: CmsRoutesReducer = (__, { Layout, Dashboard, ModelIndex, ModelItem }, models) => [
            {
                path: '/',
                name: 'luminix.cms.dashboard',
                element: (
                    <Layout>
                        <Outlet />
                    </Layout>
                ),
                children: [
                    {
                        path: '/',
                        name: 'luminix.cms.dashboard',
                        element: (
                            <Dashboard />
                        )
                    },
                    ...Object.entries(models).flatMap(([key, Model]) => ([
                        {
                            path: '/' + _.kebabCase(Model.plural()),
                            name: `luminix.cms.${key}.index`,
                            element: (
                                <ModelIndex Model={Model} />
                            )
                        },
                        {
                            path: '/' + _.kebabCase(Model.plural()) + '/:id',
                            name: `luminix.cms.${key}.item`,
                            element: (
                                <ModelItem Model={Model} />
                            )
                        }
                    ])),
                ],
            }
        ];

        this.reducer('cmsRoutes', routes, 0);

        this.app.make('route').reducer('routerOptions', (opts) => ({
            ...opts,
            basename: this.app.make('config').get('luminix.cms.url', '/luminix-admin')
        }));
    }


    make()
    {
        return (this.cmsRoutes as CmsRoutesReducer)([], this.app.make('cms.component').make(), this.app.make('model').make());
    }


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reducer(_: string, __: ReducerCallback, ___ = 10) {
        throw new Error('Method not implemented.');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: unknown;

}


export default Reducible(RouteFacade);

