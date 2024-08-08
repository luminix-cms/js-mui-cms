import { Plugin } from '@luminix/core';
import i18n, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';

class i18NextPlugin extends Plugin {

    name = 'Luminix CMS i18Next Plugin';

    constructor(
        private options: InitOptions,
    ) {
        super();
    }

    register(): void {
        
        i18n.use(initReactI18next)
            .init({
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
}

export default i18NextPlugin;

