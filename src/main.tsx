import React from 'react';
import ReactDOM from 'react-dom/client';

import LuminixCms from './components/LuminixCms';

import { InitOptions } from 'i18next';


const container = document.getElementById('root');

if (!container) {
    throw new Error('Failed to find the root element');
}

const i18NextOptions: InitOptions = {
    debug: true,
};

ReactDOM.createRoot(container).render(
    <React.StrictMode>
        <LuminixCms
            i18nOptions={i18NextOptions}
        />
    </React.StrictMode>
);

