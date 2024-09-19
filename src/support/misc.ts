
import { Obj } from "@luminix/support";

/**
 * @deprecated - For demo purposes
 * 
 * Sleep for given duration
 * 
 * @param duration in milliseconds
 * @returns 
 */
export const sleep = (duration: number): Promise<void> => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}

/**
 * Check if value is set.
 * 
 * @param value 
 * @returns 
 */
export const isSet = (value: unknown) => {
    if (typeof value === 'undefined' || value === null || Obj.isEmpty(value)) {
        return false;
    }
    return true;
}
