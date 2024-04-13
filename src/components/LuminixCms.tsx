import { LuminixProvider } from '@luminix/react';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import CmsPlugin from '../CmsPlugin';
import { LuminixCmsProps } from '../types/PropTypes';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const DEFAULT_THEME = createTheme({
    palette: {
        primary: {
            main: '#1d9798',
        },
        background: {
            default: '#e9f0f1',
            
        }
    },
    
});

const LuminixCms: React.FunctionComponent<LuminixCmsProps> = ({ theme = DEFAULT_THEME }) => (
    <ThemeProvider theme={theme}>
        <LuminixProvider
            routes={(app) => app.make('cms').getRoutes()}
            plugins={[
                new CmsPlugin(),
            ]}
            config={{
                app: { 
                    debug: true,
                    url: 'http://localhost'
                },
                // luminix: {
                //     cms: {
                //         layout: {
                //             appBar: {
                //                 height: 90,
                //             }
                //         }
                //     }
                // }
            }}
        />
    </ThemeProvider>
);

export default LuminixCms;
