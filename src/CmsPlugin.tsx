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
import DesktopPageTitle from './components/DesktopPageTitle';
import SearchBar from './components/Layout/SearchBar';
import Actions from './components/ModelIndex/Actions';
import Table from './components/ModelIndex/Table';
import TableHead from './components/ModelIndex/Table/TableHead';
import TableBody from './components/ModelIndex/Table/TableBody';
import ShrinkedCell from './components/ModelIndex/Table/ShrinkedCell';
import Pagination from './components/ModelIndex/Pagination';
import TableRow from './components/ModelIndex/Table/TableBody/TableRow';
import { Column } from './types/Table';
import PaginationDetails from './components/ModelIndex/PaginationDetails';
import PerPageSwitch from './components/ModelIndex/PerPageSwitch';

let app: AppFacade;

class CmsPlugin extends Plugin {

    name = 'Luminix CMS Plugin';

    

    register(appFacade: AppFacade): void {

        app = appFacade;

        app.bind('cms', new CmsFacade(app));

        app.once('booting', () => {
            this.bootModels();
        });
    }


    boot() {
        this.bootComponents();
        this.bootRoutes();
        this.bootMenu();
        this.bootModifiers();
        
    }

    bootModels() {
        app.make('model').reducer('model', (model: typeof Model, abstract: string) => {
            return class extends model {
                static icon() {
                    if (abstract === 'user') {
                        return (
                            <PeopleOutlinedIcon />
                        );
                    }
                    return (
                        <CategoryOutlinedIcon />
                    );
                }
            }
        }, 0);

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

            DesktopPageTitle,
            RecursiveList,
            RecursiveMenu,
            
            'Layout.AppBar': AppBar,
            'Layout.Drawer': Drawer,
            'Layout.AppBar.MenuButton': MenuButton,
            'Layout.SearchBar': SearchBar,

            'ModelIndex.Actions': Actions,
            'ModelIndex.Pagination': Pagination,
            'ModelIndex.PaginationDetails': PaginationDetails,
            'ModelIndex.PerPageSwitch': PerPageSwitch,
            'ModelIndex.Table': Table,
            'ModelIndex.Table.TableHead': TableHead,
            'ModelIndex.Table.TableBody': TableBody,
            'ModelIndex.Table.TableBody.TableRow': TableRow,
            'ModelIndex.Table.ShrinkedCell': ShrinkedCell,



            
            
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
                        icon: Model.icon(),
                        
                    })),
                
            ]
        }, 0);
    }

    bootModifiers() {

        app.make('cms').reducer('modelUserColumns', (columns: Column[]) => [
            ...columns,
            {
                key: 'email',
                label: 'Email',
                align: 'right',
            },
            {
                key: 'created_at',
                label: 'Created At',
                size: 'small',
                align: 'right',
            },
        ]);

    }


}

export default CmsPlugin;

