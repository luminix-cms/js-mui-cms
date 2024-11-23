import { HasFacadeAccessor, MakeFacade } from "@luminix/support";
import { FilterService } from "../services/FilterService";

class FilterFacade implements HasFacadeAccessor {

    getFacadeAccessor(): string {
        return 'filter';
    }

}

const Filter = MakeFacade<FilterService, FilterFacade>(FilterFacade);

export default Filter;
