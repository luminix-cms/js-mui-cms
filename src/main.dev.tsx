import React from 'react';
import ReactDOM from 'react-dom/client';

import LuminixCms from './components/LuminixCms';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import '@luminix/react/css/ReactForms.css';
import { axios } from '@luminix/support';


const container = document.getElementById('root');

if (!container) {
    throw new Error('Failed to find the root element');
}

axios.get('http://localhost/luminix-api/init').then((response) => {
    console.log(response.data);

    ReactDOM.createRoot(container).render(
        <React.StrictMode>
            <LuminixCms 
                config={response.data}
            />
        </React.StrictMode>
    );
});


