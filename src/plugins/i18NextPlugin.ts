import { Model, Plugin, ReducibleInterface } from '@luminix/core';
import { AppFacade, AppFacades, ModelFacade } from '@luminix/core/dist/types/App';
import { ConfigFacade } from '@luminix/core/dist/types/Config';
import i18n, { InitOptions } from 'i18next';
import _ from 'lodash';
import { initReactI18next } from 'react-i18next';
import { Column, MassAction, StaticAction } from '../types/Table';
import { MenuItem } from '../types/Menu';
import { InputProps } from '@luminix/react/dist/types/Form';

class i18NextPlugin extends Plugin {

    name = 'Luminix CMS i18Next Plugin';

    constructor(
        private options: InitOptions,
    ) {
        super();
    }

    register(app: AppFacade): void {
        app.once('booting', () => {
            this.initI18Next(app.make('config'));

            this.translateModelNames(app.make('model'));
        });
    }

    boot({ cms, model, forms }: AppFacades): void {

        this.translateModelColumns(model, cms);
        this.translateMenuEntries(cms);
        this.translateInstanceActions(cms);
        this.translateMassActions(cms);
        this.translateFormLabels(forms);
        this.translateStaticActions(cms);
    }


    private initI18Next(config: ConfigFacade): void {
        
        i18n.use(initReactI18next)
            .init({
                lng: config.get('app.locale', 'en') as string,
                fallbackLng: config.get('app.fallback_locale', 'en') as string,
                resources: {
                    [config.get('app.locale', 'en') as string]: {
                        translation: config.get('trans', {}) as object,
                    }
                },
                ...this.options,
                interpolation: {
                    prefix: ':',
                    suffix: '',
                    prefixEscaped: ':\\b', // start with : and follow by word boundary
                    suffixEscaped: '(?:\\b)', // match with word boundary as suffix but don't capture it
                    ...this.options.interpolation,
                },
                debug: config.get('app.debug', false) as boolean,
            });
    }

    private translateModelNames(model: ModelFacade) {

        model.reducer(
            'model',
            (Base: typeof Model) => {
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

    private translateModelColumns(
        model: ModelFacade,
        cms: ReducibleInterface
    ) {
        for (const className of Object.keys(model.make())) {
            cms.reducer(
                `model${_.upperFirst(_.camelCase(className))}Columns`,
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

    private translateMenuEntries(cms: ReducibleInterface) {
        cms.reducer(
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

    private translateMassActions(cms: ReducibleInterface) {
        cms.reducer(
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

    private translateInstanceActions(cms: ReducibleInterface) {
        cms.reducer(
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

    private translateStaticActions(cms: ReducibleInterface) {
        cms.reducer(
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
        )
    }

    private translateFormLabels(forms: ReducibleInterface) {
        forms.reducer(
            'getDefaultInputProps',
            (props: InputProps<string> | InputProps<string>[]) => {
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

export default i18NextPlugin;

