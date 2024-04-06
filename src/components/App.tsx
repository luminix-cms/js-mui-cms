import React from 'react';

import { LuminixProvider } from '@luminix/react';

import routes from '../routes';
import { LuminixProviderProps } from '@luminix/react/dist/components/LuminixProvider';

import manifest from '../assets/manifest.json';

import { AppConfiguration } from '@luminix/core/dist/types/Config';

type AppProps = Partial<LuminixProviderProps>;


export const App: React.FunctionComponent<AppProps> = (props) => {


    return (
        <LuminixProvider
            routes={routes}
            config={{
                app: { debug: true },
                manifest: manifest as unknown as AppConfiguration['manifest'],
            }}
            {...props}
        />
    );
};


export default App;

