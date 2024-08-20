import React from 'react';
import ReactDOM from 'react-dom/client';

import LuminixCms from './components/LuminixCms';

import { InitOptions } from 'i18next';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import '@luminix/react/css/ReactForms.css';


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

