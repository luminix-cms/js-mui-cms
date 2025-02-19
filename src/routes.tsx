import { Outlet } from "react-router-dom";

import { PaginationProvider } from "@luminix/react";

import { useMediaQuery } from '@mui/material';

import { CmsRoutesReducer } from "./types/Reducers";
import LayoutProvider from "./components/providers/LayoutProvider";
import ModelProvider from "./components/providers/ModelProvider";
import DialogProvider from "./components/providers/DialogProvider";
import NotificationProvider from "./components/providers/NotificationProvider";
import { Str } from "@luminix/support";

// eslint-disable-next-line react-refresh/only-export-components
const LayoutProviderStack: React.FC<React.PropsWithChildren> = ({ children }) => {

    const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    return (
        <NotificationProvider
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant={isDarkMode
                ? 'standard'
                : 'filled'}
        >
            <DialogProvider>
                <LayoutProvider>
                    {children}
                </LayoutProvider>
            </DialogProvider>
        </NotificationProvider>
    );
};


const routes: CmsRoutesReducer = (__, { Layout, Dashboard, ModelIndex, ModelItem, /* Error */ }, models) => [
    {
        element: (
            <LayoutProviderStack>
                <Layout>
                    <Outlet />
                </Layout>
            </LayoutProviderStack>
        ),
        // errorElement: (
        //     <Error />
        // ),
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
                    path: '/' + Str.kebab(Model.plural()),
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
                    path: '/' + Str.kebab(Model.plural()) + '/create',
                    name: `luminix.cms.${key}.create`,
                    element: (
                        <ModelProvider Model={Model}>
                            <ModelItem create />
                        </ModelProvider>
                    )
                },
                {
                    path: '/' + Str.kebab(Model.plural()) + '/:id',
                    name: `luminix.cms.${key}.show`,
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
