import { AppFacade, Model, Plugin } from '@luminix/core';

import CmsFacade from './facades/Cms';

import Layout from './views/Layout/Layout';
import Dashboard from './views/Dashboard';
import ModelIndex from './views/ModelIndex';
import ModelItem from './views/ModelItem';
import routes from './routes';
import AppBar from './components/Layout/AppBar';
import MenuButton from './components/Layout/AppBar/MenuButton';
import Drawer from './components/Layout/Drawer';
import RecursiveList from './components/RecursiveList';
import RecursiveMenu from './components/RecursiveMenu';

import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';


import _ from 'lodash';
import { MenuItem } from './types/Menu';
import Error from './views/Error';

let app: AppFacade;

class CmsPlugin extends Plugin {

    name = 'Luminix CMS Plugin';

    

    register(appFacade: AppFacade): void {
        
        app = appFacade;

        app.bind('cms', new CmsFacade(app));


    }


    boot() {
        this.bootComponents();
        this.bootRoutes();
        this.bootMenu();

    }

    bootRoutes() {
        app.make('cms').reducer('cmsRoutes', routes, 0);
        app.make('route').reducer('routerOptions', (opts) => ({
            ...opts,
            basename: app.make('config').get('luminix.cms.url', '/luminix-admin')
        }));
    }

    bootComponents() {
        app.make('cms').reducer('componentMap', () => ({
            Layout,
            Dashboard,
            ModelIndex,
            ModelItem,

            Error,

            RecursiveList,
            RecursiveMenu,

            'Layout.AppBar': AppBar,
            'Layout.Drawer': Drawer,
            'Layout.AppBar.MenuButton': MenuButton,
            
            
        }), 0);
    }

    bootMenu() {
        app.make('cms').reducer('menuItems', (items: MenuItem[], models: Record<string, typeof Model>) => {
            return [
                ...items,
                {
                    key: 'dashboard',
                    text: 'Dashboard',
                    to: '/',
                    icon: <DashboardOutlinedIcon />,
                },
                ...Object.entries(models)
                    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                    .map(([key, Model]) => ({
                        key,
                        text: Model.plural(),
                        to: '/' + _.kebabCase(Model.plural()),
                        icon: key === 'user' 
                            ? <PeopleOutlinedIcon />
                            : <CategoryOutlinedIcon />,
                        
                    })),
                
            ]
        }, 0);
    }


}

export default CmsPlugin;

