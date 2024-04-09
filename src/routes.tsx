import { Outlet } from "react-router-dom";
import _ from "lodash";

import CssBaseline from '@mui/material/CssBaseline';

import { CmsRoutesReducer } from "./types/Reducers";
import LayoutProvider from "./providers/LayoutProvider";

const routes: CmsRoutesReducer = (__, { Layout, Dashboard, ModelIndex, ModelItem, Error }, models) => [
    {
        element: (
            <LayoutProvider>
                <CssBaseline />
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
