import React from 'react';
import ReactDOM from 'react-dom/client';

import LuminixCms from './components/LuminixCms';

const container = document.getElementById('root');

if (!container) {
    throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(container).render(
    <React.StrictMode>
        <LuminixCms />
    </React.StrictMode>
);

