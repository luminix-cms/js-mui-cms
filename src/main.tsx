import React from 'react'
import ReactDOM from 'react-dom'
import { LuminixProvider } from '@luminix/react';

import Component from './facades/Component';
import Route from './facades/Route';

ReactDOM.render(
    <React.StrictMode>
        <LuminixProvider
            routes={(app) => {
                const routes = app.make('cms.route').make();
            
                return routes;
            }}
            onInit={({ source: app }) => {
                app.bind('cms.component', new Component());
                app.bind('cms.route', new Route(app));
            }}
            config={{
                app: { 
                    debug: true,
                    url: 'http://localhost'
                },
            }}
        />
    </React.StrictMode>,
    document.getElementById('root')
);
