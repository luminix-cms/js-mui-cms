import { ServiceProvider, Str } from '@luminix/support';
import { Config, Model, ModelType, Route } from '@luminix/core';
import { ModelFormProps } from '@luminix/react';

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

import {
    Add as AddIcon,
    AddCircleOutline as AddCircleOutlineIcon,
    ArrowDownward as ArrowDownwardIcon,
    ArrowDropDown as ArrowDropDownIcon,
    ArrowUpward as ArrowUpwardIcon,
    CategoryOutlined as CategoryOutlinedIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Close as CloseIcon,
    DashboardOutlined as DashboardOutlinedIcon,
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
    FilterList as FilterListIcon,
    FirstPage as FirstPageIcon,
    HighlightOffOutlined as HighlightOffOutlinedIcon,
    LastPage as LastPageIcon,
    Menu as MenuIcon,
    MoreVert as MoreVertIcon,
    PeopleOutlined as PeopleOutlinedIcon,
    Search as SearchIcon,
    SwapVert as SwapVertIcon,
} from '@mui/icons-material';

import { StaticAction, MassAction, InstanceAction } from '../types/Table';
import { MenuItem } from '../types/Menu';
//import { DisplayableTab } from './types/Tabs';

import { instanceActionHandlers, massActionHandlers, staticActionHandlers } from '../support/handlers';

import Cms from '../facades/Cms';
import Icon from '../facades/Icon';

import CmsService from '../services/CmsService';
import FilterService from '../services/FilterService';
import IconService from '../services/IconService';

import InstanceActions from '../components/ModelIndex/InstanceActions';
import AppLogo from '../components/Layout/AppLogo';

// 

class CmsServiceProvider extends ServiceProvider {

    static applyUserDefaults: boolean = true;

    register(): void {

        this.app.singleton('cms', () => new CmsService());
        this.app.singleton('filter', () => new FilterService());
        this.app.singleton('icon', () => new IconService());

        this.registerIcons();

        // this.app.once('booting', () => {
        //     this.addIconsToModels();
        // });
    }


    boot() {
        this.bootComponents();
        this.bootRoutes();
        this.bootMenu();
        this.bootMassActions();
        this.bootInstanceActions();
        this.bootStaticActions();

        if (CmsServiceProvider.applyUserDefaults) {
            this.bootDefaultUserModifiers();
        }

        this.app.on('booted', () => {
            this.app.make('cms').booted();
        });
    }

    // private addIconsToModels() {

    //     Model.reducer(
    //         'model',
    //         (Base, abstract) => {
    //             return class extends Base {
    //                 static icon() {
    //                     if (abstract === 'user') {
    //                         return Icon.render('PeopleOutlined');
    //                     }
    //                     return Icon.render('CategoryOutlined');
    //                 }
    //             }
    //         },
    //         0
    //     );

    // }

    private registerIcons() {

        Icon.registerIcon({
            'Add': AddIcon,
            'AddCircleOutline': AddCircleOutlineIcon,
            'ArrowDownward': ArrowDownwardIcon,
            'ArrowDropDown': ArrowDropDownIcon,
            'ArrowUpward': ArrowUpwardIcon,
            'CategoryOutlined': CategoryOutlinedIcon,
            'ChevronLeft': ChevronLeftIcon,
            'ChevronRight': ChevronRightIcon,
            'Close': CloseIcon,
            'DashboardOutlined': DashboardOutlinedIcon,
            'ExpandLess': ExpandLessIcon,
            'ExpandMore': ExpandMoreIcon,
            'FilterList': FilterListIcon,
            'FirstPage': FirstPageIcon,
            'HighlightOffOutlined': HighlightOffOutlinedIcon,
            'LastPage': LastPageIcon,
            'Menu': MenuIcon,
            'MoreVert': MoreVertIcon,
            'PeopleOutlined': PeopleOutlinedIcon,
            'Search': SearchIcon,
            'SwapVert': SwapVertIcon,
        });

        Icon.forModel('user', 'PeopleOutlined');

    }

    private bootRoutes() {
        Cms.reducer('cmsRoutes', routes, 0);

        Route.reducer('domRouterOptions', (opts) => ({
            ...opts,
            basename: Config.get('luminix.admin.url', '/admin')
        }));
    }

    private bootComponents() {
        Cms.reducer('componentMap', () => ({
            
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
            'Layout.AppLogo': AppLogo,
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

    private bootMenu() {
        Cms.reducer('menuItems', (items: MenuItem[], models: Record<string, typeof Model>) => {
            return [
                ...items,
                {
                    key: 'dashboard',
                    text: 'Dashboard',
                    to: '/',
                    icon: Icon.render('DashboardOutlined'),
                },
                ...Object.entries(models)
                    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                    .map(([key, Model]) => ({
                        key,
                        text: Model.plural(),
                        to: '/' + Str.kebab(Model.plural()),
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        icon: (Model as unknown as any).icon(),
                        
                    })),
                
            ]
        }, 0);
    }

    private bootDefaultUserModifiers() {

        Cms.reducer('modelUserColumns', () => [
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

        Cms.reducer('wireModelFormProps', (props: ModelFormProps, item?: ModelType) => {
            if (item?.getType() === 'user') {
                return {
                    ...props,
                    confirmed: 'password',
                };
            }

            return props;
        });
        
        // this.app.make('cms').reducer('modelPostTabs', (tabs: DisplayableTab[]) => [
        //     {
        //         label: 'Published',
        //         value: 'published',
        //     },
        //     ...tabs,
        // ]);

    }

    private bootMassActions() {

        Cms.reducer('massActions', (actions: MassAction[], ModelClass: typeof Model, currentTab: string) => {
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

    private bootInstanceActions() {

        Cms.reducer('instanceActions', (actions: InstanceAction[], ModelClass: typeof Model, currentTab: string) => {
            const defaultActions: InstanceAction[] = [];

            const { softDeletes } = ModelClass.getSchema();

            if (currentTab !== 'trashed') {
                defaultActions.push({
                    label: softDeletes ? 'Send to trash' : 'Delete permanently',
                    callback: instanceActionHandlers.delete(ModelClass),
                });
            } else {
                defaultActions.push({
                    label: 'Restore',
                    callback: instanceActionHandlers.restore(ModelClass),
                });

                defaultActions.push({
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

    private bootStaticActions() {
        Cms.reducer('staticActions', (actions: StaticAction[], ModelClass: typeof Model, currentTab: string) => {
            if (currentTab === 'trashed') {
                return actions;
            }
            return [
                ...actions,
                {
                    key: 'create',
                    label: `Create ${ModelClass.singular()}`,
                    callback: staticActionHandlers.create(ModelClass),
                    icon: Icon.render('Add'),
                },
            ];
        }, 0);
    }

    

}

export default CmsServiceProvider;
