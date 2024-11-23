import { HasFacadeAccessor, MakeFacade } from "@luminix/support";
import { App } from "@luminix/core";

import { FilterService } from "../services/FilterService";

class FilterFacade implements HasFacadeAccessor {

    getFacadeAccessor(): string {
        return 'filter';
    }

}

const Filter = MakeFacade<FilterService, FilterFacade>(FilterFacade, App);

export default Filter;
