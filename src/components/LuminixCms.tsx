import { LuminixProvider } from '@luminix/react';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import CmsPlugin from '../CmsPlugin';
import { LuminixCmsProps } from '../types/PropTypes';

const LuminixCms: React.FunctionComponent<LuminixCmsProps> = ({ theme = createTheme({}) }) => (
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
