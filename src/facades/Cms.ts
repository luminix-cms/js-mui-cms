import { HasFacadeAccessor, MakeFacade } from "@luminix/support";
import { CmsService } from "../services/CmsService";

class CmsFacade implements HasFacadeAccessor {

    getFacadeAccessor(): string {
        return 'cms';
    }
    
}

const Cms = MakeFacade<CmsService, CmsFacade>(CmsFacade);

export default Cms;
