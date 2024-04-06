import React from 'react';

import { LuminixProvider } from '@luminix/react';

import { AppProps } from '../types/PropTypes';


export const App: React.FunctionComponent<AppProps> = (props) => {


    return (
        <LuminixProvider
            routes={(app) => {
                const routes = app.make('cms.route').make();
            
                return routes;
            }}
            config={{
                app: { 
                    debug: true,
                    url: 'http://localhost'
                },
            }}
            {...props}
        />
    );
};


export default App;

