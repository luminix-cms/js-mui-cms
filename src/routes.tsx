import { Outlet } from "react-router-dom";
import _ from "lodash";

import { CmsRoutesReducer } from "./types/Reducers";

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

export default routes;
