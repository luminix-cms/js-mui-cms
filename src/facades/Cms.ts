import { HasFacadeAccessor, MakeFacade } from "@luminix/support";
import { App } from "@luminix/core";

import { CmsService } from "../services/CmsService";

class CmsFacade implements HasFacadeAccessor {

    getFacadeAccessor(): string {
        return 'cms';
    }
    
}

const Cms = MakeFacade<CmsService, CmsFacade>(CmsFacade, App);

export default Cms;
