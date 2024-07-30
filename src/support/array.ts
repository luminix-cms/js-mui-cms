/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Removes duplicates from an array.
 * If a key is provided, duplicates are removed based on the value of that key.
 * 
 * @param value 
 * @param key 
 * @returns 
 */
export const unique = (value: any[], key?: string) => {
    if (typeof key === 'string') {
        const keys = [ ...new Set(value.map((item) => item[key])) ];

        return keys.map((k) => value.find((item) => item[key] === k));
    }

    return [ ...new Set(value) ];
}
