import { AppFacade, Plugin } from '@luminix/core';

import Component from './facades/Component';
import Route from './facades/Route';

import Layout from './views/Layout/Layout';
import Dashboard from './views/Dashboard';
import ModelIndex from './views/ModelIndex';
import ModelItem from './views/ModelItem';
import routes from './routes';
import AppBar from './components/Layout/AppBar';

let app: AppFacade;

class CmsPlugin extends Plugin {

    name = 'Luminix CMS Plugin';

    

    register(appFacade: AppFacade): void {
        
        app = appFacade;

        app.bind('cms.component', new Component());
        app.bind('cms.route', new Route(app));


    }


    boot() {
        this.registerComponents();
        this.registerRoutes();

    }

    registerRoutes() {
        app.make('cms.route').reducer('cmsRoutes', routes, 0);
        app.make('route').reducer('routerOptions', (opts) => ({
            ...opts,
            basename: app.make('config').get('luminix.cms.url', '/luminix-admin')
        }));
    }

    registerComponents() {
        app.make('cms.component').reducer('componentMap', () => ({
            Layout,
            Dashboard,
            ModelIndex,
            ModelItem,
            'Layout.AppBar': AppBar,
            
        }), 0);
    }


}

export default CmsPlugin;

