import { Outlet } from "react-router-dom";
import _ from "lodash";

import { CmsRoutesReducer } from "./types/Reducers";
import LayoutProvider from "./providers/LayoutProvider";
import { PaginationProvider } from "@luminix/react";
import ModelProvider from "./providers/ModelProvider";

const routes: CmsRoutesReducer = (__, { Layout, Dashboard, ModelIndex, ModelItem, Error }, models) => [
    {
        element: (
            <LayoutProvider>
                <Layout>
                    <Outlet />
                </Layout>
            </LayoutProvider>
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
