import React from 'react';

import { LuminixProvider } from '@luminix/react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useMediaQuery, CssBaseline } from '@mui/material';

import CmsPlugin from '../plugins/CmsPlugin';
import { LuminixCmsProps } from '../types/PropTypes';

import i18NextPlugin from '../plugins/i18NextPlugin';

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
    plugins,
    i18nOptions = {},
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

    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <LuminixProvider
                routes={(app) => app.make('cms').getRoutes()}
                plugins={[
                    new CmsPlugin(),
                    new i18NextPlugin(i18nOptions),
                    ...plugins || [],
                ]}
                {...props}
            />
        </ThemeProvider>
    );
};

export default LuminixCms;
