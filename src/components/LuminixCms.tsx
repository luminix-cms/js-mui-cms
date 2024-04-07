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
    },
});

const LuminixCms: React.FunctionComponent<LuminixCmsProps> = ({ theme = DEFAULT_THEME }) => (
    <ThemeProvider theme={theme}>        
        <LuminixProvider
            routes={(app) => app.make('cms.route').make()}
            plugins={[
                new CmsPlugin(),
            ]}
            config={{
                app: { 
                    debug: true,
                    url: 'http://localhost'
                },
            }}
        />
    </ThemeProvider>
);

export default LuminixCms;
