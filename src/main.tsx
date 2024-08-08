import React from 'react';
import ReactDOM from 'react-dom/client';

import LuminixCms from './components/LuminixCms';
import i18NextPlugin from './plugins/i18NextPlugin';

import ptBR from '../lang/pt-BR.json';
import { InitOptions } from 'i18next';


const container = document.getElementById('root');

if (!container) {
    throw new Error('Failed to find the root element');
}

const i18NextOptions: InitOptions = {
    resources: {
        ['pt-BR']: {
            translation: ptBR,
        },
    },
    lng: 'pt-BR',
    debug: true,
};

ReactDOM.createRoot(container).render(
    <React.StrictMode>
        <LuminixCms
            plugins={[
                new i18NextPlugin(i18NextOptions),
            ]}
        />
    </React.StrictMode>
);

