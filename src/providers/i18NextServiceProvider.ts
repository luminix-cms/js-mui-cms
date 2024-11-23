import { ServiceProvider, Str } from '@luminix/support';
import { Config, Model } from '@luminix/core';
import { Forms } from '@luminix/react';

import i18n, { InitOptions, InterpolationOptions } from 'i18next';

import { initReactI18next } from 'react-i18next';
import { Column, MassAction, StaticAction } from '../types/Table';
import { MenuItem } from '../types/Menu';
import Cms from '../facades/Cms';

class i18NextServiceProvider extends ServiceProvider {

    register(): void {
        this.app.once('booting', () => {
            this.initI18Next();

            this.translateModelNames();
        });
    }

    boot(): void {

        this.translateModelColumns();
        this.translateMenuEntries();
        this.translateInstanceActions();
        this.translateMassActions();
        this.translateFormLabels();
        this.translateStaticActions();
    }


    private initI18Next(): void {
        
        i18n.use(initReactI18next)
            .init({
                lng: Config.get('app.locale', 'en') as string,
                fallbackLng: Config.get('app.fallback_locale', 'en') as string,
                resources: {
                    [Config.get('app.locale', 'en') as string]: {
                        translation: Config.get('trans', {}) as object,
                    }
                },
                ...Config.get('i18n', {}) as InitOptions,
                interpolation: {
                    prefix: ':',
                    suffix: '',
                    prefixEscaped: ':\\b', // start with : and follow by word boundary
                    suffixEscaped: '(?:\\b)', // match with word boundary as suffix but don't capture it
                    ...Config.get('i18n.interpolation', {}) as InterpolationOptions,
                },
                debug: Config.get('app.debug', false) as boolean,
            });
    }

    private translateModelNames() {

        Model.reducer(
            'model',
            (Base) => {
                return class extends Base {
                    static singular(): string {
                        return i18n.t(Base.singular());
                    }

                    static plural(): string {
                        return i18n.t(Base.plural());
                    }
                }
            },
            0
        )
    }

    private translateModelColumns() {
        for (const className of Object.keys(Model.make())) {
            Cms.reducer(
                `model${Str.studly(className)}Columns`,
                (columns: Column[]) => {
                    return columns.map((column) => {
                        return {
                            ...column,
                            label: i18n.t(column.label),
                        }
                    });
                },
                99
            );
        }

    }

    private translateMenuEntries() {
        Cms.reducer(
            'menuItems',
            (items: MenuItem[]) => {
                const dashboard = items.find((menuItem) => {
                    return menuItem.key === 'dashboard';
                });
                if (dashboard) {
                    dashboard.text = i18n.t(dashboard.text);
                }
                return items;
            },
            5
        );
    }

    private translateMassActions() {
        Cms.reducer(
            'massActions',
            (actions: MassAction[]) => {
                return actions.map((action) => {
                    return {
                        ...action,
                        label: i18n.t(action.label),
                    }
                });
            },
            99
        );
    }

    private translateInstanceActions() {
        Cms.reducer(
            'instanceActions',
            (actions: MassAction[]) => {
                return actions.map((action) => {
                    return {
                        ...action,
                        label: i18n.t(action.label),
                    }
                });
            },
            99
        );
    }

    private translateStaticActions() {
        Cms.reducer(
            'staticActions',
            (actions: StaticAction[], ModelClass: typeof Model) => {
                const create = actions.find(({ key }) => key === 'create');
                if (create) {
                    create.label = i18n.t('Create :model', {
                        model: ModelClass.singular(),
                    });
                }
                return actions;
            }
        );
    }

    private translateFormLabels() {
        Forms.reducer(
            'getDefaultInputProps',
            (props) => {
                if (!Array.isArray(props)) {
                    if (props?.label) {
                        props.label = i18n.t(props.label);
                    }
                } else {
                    props.map((prop) => {
                        if (prop?.label) {
                            prop.label = i18n.t(prop.label);
                        }
                    });
                }
                return props;
            },
            99,
        );
    }
}

export default i18NextServiceProvider;

