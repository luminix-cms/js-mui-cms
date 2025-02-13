import { HasFacadeAccessor, MakeFacade } from "@luminix/support";
import { App } from "@luminix/core";

import IconService from "../services/IconService";


class IconFacade implements HasFacadeAccessor {

    getFacadeAccessor(): string {
        return 'icon';
    }

}

const Icon = MakeFacade<IconService, IconFacade>(IconFacade, App);

export default Icon;
