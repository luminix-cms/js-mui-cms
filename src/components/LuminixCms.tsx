import React from 'react';

import { AppFacade } from '@luminix/core';
import { LuminixProvider } from '@luminix/react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useMediaQuery, CssBaseline } from '@mui/material';

import CmsServiceProvider from '../providers/CmsServiceProvider';
import { LuminixCmsProps } from '../types/PropTypes';

import i18NextServiceProvider from '../providers/i18NextServiceProvider';

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

const routes = (app: AppFacade) => app.make('cms').getRoutes();

const LuminixCms: React.FunctionComponent<LuminixCmsProps> = ({
    theme = DEFAULT_THEME,
    providers: provided,
    ...props
}) => {

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const muiTheme = React.useMemo(() => createTheme({
        ...theme,
        palette: {
            ...theme.palette,
            mode: prefersDarkMode ? 'dark' : 'light',
        },
    }), [theme, prefersDarkMode]);

    const providers = React.useMemo(() => [
        CmsServiceProvider,
        i18NextServiceProvider,
        ...provided || [],
    ], [provided]);

    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <LuminixProvider
                routes={routes}
                providers={providers}
                {...props}
            />
        </ThemeProvider>
    );
};

export default LuminixCms;
