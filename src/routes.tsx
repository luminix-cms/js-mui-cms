import { Outlet } from "react-router-dom";
import _ from "lodash";
import { PaginationProvider } from "@luminix/react";

import { CmsRoutesReducer } from "./types/Reducers";
import LayoutProvider from "./providers/LayoutProvider";
import ModelProvider from "./providers/ModelProvider";
import DialogProvider from "./providers/DialogProvider";
import NotificationProvider from "./providers/NotificationProvider";

const routes: CmsRoutesReducer = (__, { Layout, Dashboard, ModelIndex, ModelItem, Error }, models) => [
    {
        element: (
            <NotificationProvider
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant={window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'standard'
                    : 'filled'}
                autoHideDuration={9999990}
            >
                <DialogProvider>
                    <LayoutProvider>
                        <Layout>
                            <Outlet />
                        </Layout>
                    </LayoutProvider>
                </DialogProvider>
            </NotificationProvider>
        ),
        errorElement: (
            <Error />
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
                        <ModelProvider Model={Model}>
                            <PaginationProvider factory={Model.query}>
                                <ModelIndex />
                            </PaginationProvider>
                        </ModelProvider>
                    )
                },
                {
                    path: '/' + _.kebabCase(Model.plural()) + '/create',
                    name: `luminix.cms.${key}.item`,
                    element: (
                        <ModelProvider Model={Model}>
                            <ModelItem create />
                        </ModelProvider>
                    )
                },
                {
                    path: '/' + _.kebabCase(Model.plural()) + '/:id',
                    name: `luminix.cms.${key}.item`,
                    element: (
                        <ModelProvider Model={Model}>
                            <ModelItem />
                        </ModelProvider>
                    )
                }
            ])),
        ],
    }
];

export default routes;
