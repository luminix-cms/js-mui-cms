import { RouteObject } from "react-router-dom";

import { app } from "@luminix/core";


const routes: () => RouteObject[] = () => {
    const {
        Layout, Dashboard
    } = app('cms.component').make();

    return [
        {
            path: '/',
            element: (
                <Layout />
            ),
            children: [
                {
                    path: '/',
                    element: (
                        <Dashboard />
                    )
                }
            ],
        }
    ];
}


export default routes;

