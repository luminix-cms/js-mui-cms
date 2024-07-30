/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from 'lodash';

export const searchParamsToObject = (searchParams: URLSearchParams) => {
    
    const obj: Record<string, any> = {};

    for (const [key, value] of searchParams.entries()) {
        _.set(obj, key, value);
    }

    return obj;
}
