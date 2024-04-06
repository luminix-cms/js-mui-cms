import { LuminixProvider } from '@luminix/react';

import CmsPlugin from '../CmsPlugin';

const LuminixCms: React.FunctionComponent = () => (
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
);

export default LuminixCms;
