// import React from 'react';

import { AppFacade, Reducible } from '@luminix/core';

class RouteFacade {

    constructor(
        private app: AppFacade
    ) {

    }


    make()
    {
        return this.cmsRoutes([], this.app.make('cms.component').make(), this.app.make('model').make());
    }



    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;

}


export default Reducible(RouteFacade);

