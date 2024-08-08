import React from 'react';

import { LuminixProvider } from '@luminix/react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';

import CmsPlugin from '../CmsPlugin';
import { LuminixCmsProps } from '../types/PropTypes';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import '@luminix/react/css/ReactForms.css';

import NotificationProvider from '../providers/NotificationProvider';
import DialogProvider from '../providers/DialogProvider';
// import i18NextPlugin from '../plugins/i18NextPlugin';

// import ptBR from '../../lang/pt-BR.json';

const DEFAULT_THEME = {
    palette: {
        primary: {
            main: '#1d9798',
        },
        secondary: {
            main: '#fa510c',
        },
    },
    
};

const LuminixCms: React.FunctionComponent<LuminixCmsProps> = ({
    theme = DEFAULT_THEME,
    plugins
}) => {

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const muiTheme = React.useMemo(() => createTheme({
        ...theme,
        palette: {
            ...theme.palette,
            mode: prefersDarkMode ? 'dark' : 'light',
        },
    }), [theme, prefersDarkMode]);

    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <NotificationProvider
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant={prefersDarkMode ? 'standard' : 'filled'}
            >
                <DialogProvider>
                    <LuminixProvider
                        routes={(app) => app.make('cms').getRoutes()}
                        plugins={[
                            new CmsPlugin(),
                            ...plugins || [],
                        ]}
                        config={{
                            app: {
                                debug: true,
                                url: 'http://localhost',
                            },
                        }}
                    />
                </DialogProvider>
            </NotificationProvider>
        </ThemeProvider>
    );
};

export default LuminixCms;
