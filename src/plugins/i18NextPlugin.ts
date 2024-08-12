import { Model, Plugin } from '@luminix/core';
import { AppFacade, AppFacades, ModelFacade } from '@luminix/core/dist/types/App';
import { ConfigFacade } from '@luminix/core/dist/types/Config';
import i18n, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';

class i18NextPlugin extends Plugin {

    name = 'Luminix CMS i18Next Plugin';

    constructor(
        private options: InitOptions,
    ) {
        super();
    }

    register(app: AppFacade): void {
        app.once('booting', () => {
            this.translateModelNames(app.make('model'));
        });
    }

    boot({ config }: AppFacades): void {
        this.registerI18Next(config);
    }


    private registerI18Next(config: ConfigFacade): void {
        
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
                }
            });
    }

    private translateModelNames(model: ModelFacade) {

        model.reducer(
            'model',
            (Base: typeof Model) => {
                return class extends Base {

                    static singular(): string {
                        console.log('called user translation');
                        return i18n.t(Base.singular());
                    }

                    static plural(): string {
                        console.log('called user translation');
                        return i18n.t(Base.plural());
                    }

                }
            },
            0
        )
    }
}

export default i18NextPlugin;

