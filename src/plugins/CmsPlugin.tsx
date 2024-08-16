import _ from 'lodash';

import { AppFacade, Model, Plugin } from '@luminix/core';
import { ModelFormProps } from '@luminix/react/dist/types/Form';

import CmsFacade from '../facades/Cms';
import FilterFacade from '../facades/Filter';

import routes from '../routes';

import Dashboard from '../views/Dashboard';
import Error from '../views/Error';
import Layout from '../views/Layout/Layout';
import ModelIndex from '../views/ModelIndex';
import ModelItem from '../views/ModelItem';

import StaticActions from '../components/ModelIndex/StaticActions';
import AppBar from '../components/Layout/AppBar';
import BackButton from '../components/Layout/BackButton';
import Drawer from '../components/Layout/Drawer';
import DesktopPageTitle from '../components/DesktopPageTitle';
import Filter from '../components/ModelIndex/Filter';
import MassActions from '../components/ModelIndex/MassActions';
import MenuButton from '../components/Layout/AppBar/MenuButton';
import Pagination from '../components/ModelIndex/Pagination';
import PaginationDetails from '../components/ModelIndex/PaginationDetails';
import PerPageSwitch from '../components/ModelIndex/PerPageSwitch';
import SearchBar from '../components/Layout/SearchBar';
import ShrinkedCell from '../components/ModelIndex/Table/ShrinkedCell';
import Sort from '../components/ModelIndex/Sort';
import Table from '../components/ModelIndex/Table';
import TableHead from '../components/ModelIndex/Table/TableHead';
import TableBody from '../components/ModelIndex/Table/TableBody';
import TableRow from '../components/ModelIndex/Table/TableBody/TableRow';
import TableFooter from '../components/ModelIndex/Table/TableFooter';
import TableToolbar from '../components/ModelIndex/Table/TableToolbar';
import Tabs from '../components/ModelIndex/Tabs';

import Breadcrumbs from '../components/Breadcrumbs';
import RecursiveList from '../components/RecursiveList';
import RecursiveMenu from '../components/RecursiveMenu';

import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';

import { CmsPluginOptions } from '../types/Plugin';
import { StaticAction, MassAction, InstanceAction } from '../types/Table';
import { MenuItem } from '../types/Menu';
//import { DisplayableTab } from './types/Tabs';

import { instanceActionHandlers, massActionHandlers } from '../support/handlers';
import InstanceActions from '../components/ModelIndex/InstanceActions';

let app: AppFacade;

// 

class CmsPlugin extends Plugin {

    name = 'Luminix CMS Plugin';

    constructor(
        public options: CmsPluginOptions = {}
    ) {
        super();
    }

    

    register(appFacade: AppFacade): void {

        app = appFacade;

        app.bind('cms', new CmsFacade());
        app.bind('filter', new FilterFacade());

        app.once('booting', () => {
            this.bootModels();
        });
    }


    boot() {
        this.bootComponents();
        this.bootRoutes();
        this.bootMenu();
        this.bootMassActions();
        this.bootInstanceActions();
        if (this.options.applyUserDefaults ?? true) {
            this.bootDefaultUserModifiers();
        }
    }

    bootModels() {

        app.make('model').reducer(
            'model',
            (Base: typeof Model, abstract: string) => {
                return class extends Base {
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
            },
            0
        );

    }

    bootRoutes() {
        app.make('cms').reducer('cmsRoutes', routes, 0);
        app.make('route').reducer('routerOptions', (opts) => ({
            ...opts,
            basename: app.make('config').get('luminix.admin.url', '/admin')
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
            Breadcrumbs,
            
            'Layout.AppBar': AppBar,
            'Layout.Drawer': Drawer,
            'Layout.AppBar.MenuButton': MenuButton,
            'Layout.SearchBar': SearchBar,
            'Layout.BackButton': BackButton,

            'ModelIndex.Filter': Filter,
            'ModelIndex.InstanceActions': InstanceActions,
            'ModelIndex.MassActions': MassActions,
            'ModelIndex.Pagination': Pagination,
            'ModelIndex.PaginationDetails': PaginationDetails,
            'ModelIndex.PerPageSwitch': PerPageSwitch,
            'ModelIndex.Sort': Sort,
            'ModelIndex.StaticActions': StaticActions,
            'ModelIndex.Table': Table,
            'ModelIndex.Table.TableHead': TableHead,
            'ModelIndex.Table.TableBody': TableBody,
            'ModelIndex.Table.TableFooter': TableFooter,
            'ModelIndex.Table.TableToolbar': TableToolbar,
            'ModelIndex.Table.TableBody.TableRow': TableRow,
            'ModelIndex.Table.ShrinkedCell': ShrinkedCell,
            'ModelIndex.Tabs': Tabs,
            
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
                        // TODO: use route(`luminix.cms.${model}.index`) instead
                        to: '/' + _.kebabCase(Model.plural()),
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        icon: (Model as unknown as any).icon(),
                        
                    })),
                
            ]
        }, 0);
    }

    bootDefaultUserModifiers() {

        app.make('cms').reducer('modelUserColumns', () => [
            {
                key: 'name',
                label: 'Name',
                scope: 'row',
                component: 'th',
            },
            {
                key: 'email',
                label: 'Email',
                align: 'right',
                size: 'small',
            },
            {
                key: 'created_at',
                label: 'Created At',
                align: 'right',
                size: 'small',
            },
        ], 1);

        app.make('cms').reducer('wireModelFormProps', (props: ModelFormProps, item?: Model) => {
            if (item?.getType() === 'user') {
                return {
                    ...props,
                    confirmed: 'password',
                };
            }

            return props;
        });
        
        // app.make('cms').reducer('modelPostTabs', (tabs: DisplayableTab[]) => [
        //     {
        //         label: 'Published',
        //         value: 'published',
        //     },
        //     ...tabs,
        // ]);

    }

    bootMassActions() {

        app.make('cms').reducer('massActions', (actions: MassAction[], ModelClass: typeof Model, currentTab: string) => {
            const defaultActions: MassAction[] = [];

            const { softDeletes } = ModelClass.getSchema();

            if (currentTab !== 'trashed') {
                defaultActions.push({
                    key: 'delete',
                    label: softDeletes ? 'Send to trash' : 'Delete permanently',
                    callback: massActionHandlers.delete(ModelClass),
                });
            } else {
                defaultActions.push({
                    key: 'restore',
                    label: 'Restore',
                    callback: massActionHandlers.restore(ModelClass),
                });

                defaultActions.push({
                    key: 'forceDelete',
                    label: 'Delete permanently',
                    callback: massActionHandlers.forceDelete(ModelClass),
                });
            }

            return [
                ...actions,
                ...defaultActions
            ];

        }, 0);

    }

    bootInstanceActions() {

        app.make('cms').reducer('instanceActions', (actions: InstanceAction[], ModelClass: typeof Model, currentTab: string) => {
            const defaultActions: InstanceAction[] = [];

            const { softDeletes } = ModelClass.getSchema();

            if (currentTab !== 'trashed') {
                defaultActions.push({
                    label: softDeletes ? 'Send to trash' : 'Delete permanently',
                    callback: instanceActionHandlers.delete(ModelClass),
                });
            } else {
                defaultActions.push({
                    key: 'restore',
                    label: 'Restore',
                    callback: instanceActionHandlers.restore(ModelClass),
                });

                defaultActions.push({
                    key: 'forceDelete',
                    label: 'Delete permanently',
                    callback: instanceActionHandlers.forceDelete(ModelClass),
                });
            }

            return [
                ...actions,
                ...defaultActions,
            ];

        }, 0);
    }

}

export default CmsPlugin;

