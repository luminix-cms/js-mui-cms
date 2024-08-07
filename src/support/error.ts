import { isAxiosError } from "axios";
import { NotifyFunction } from "../types/Notifications";

export function createErrorCallback(notify: NotifyFunction) {
    return (error: unknown) => {
        if (!(error instanceof Error)) {
            throw error;
        }
        notify({
            message: isAxiosError(error)
                ? error.response?.data.message ?? error.message
                : error.message,
            severity: 'error',
        });
    };
}



