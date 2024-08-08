import { Model } from "@luminix/core";
import { MassActionCallbackEvent } from "../types/Table";
import { createErrorCallback } from "./error";
import _ from "lodash";



export const massActionHandlers: Record<string, (ModelClass: typeof Model) => (e: MassActionCallbackEvent) => void> = {

    delete: (ModelClass) => async ({ selected, notify, dialog, refresh }) => {

        const confirm = await dialog({
            title: 'Confirm deletion',
            message: `Are you sure you want to ${ModelClass.getSchema().softDeletes ? 'send to trash' : 'delete permanently'} ${selected.count()} ${_.lowerFirst(selected.count() === 1
                ? ModelClass.singular()
                : ModelClass.plural())}?`,
            type: 'confirm'
        });

        if (!confirm) {
            return;
        }

        try {
            await ModelClass.delete(selected.pluck(ModelClass.getSchema().primaryKey).all());

            notify(`Successfully ${ModelClass.getSchema().softDeletes ? 'sent to trash' : 'deleted'} ${selected.count()} ${_.lowerFirst(selected.count() === 1
                ? ModelClass.singular()
                : ModelClass.plural()
            )}`);

            refresh();
        } catch (error) {
            createErrorCallback(notify)(error);
        }
    },


    restore: (ModelClass) => async ({ selected, notify, dialog, refresh }) => {
        const confirm = await dialog({
            title: 'Confirm restore',
            message: `Are you sure you want to restore ${selected.count()} ${_.lowerFirst(selected.count() === 1
                ? ModelClass.singular()
                : ModelClass.plural())}?`,
            type: 'confirm'
        });

        if (!confirm) {
            return;
        }

        try {
            await ModelClass.restore(selected.pluck(ModelClass.getSchema().primaryKey).all());
            notify(`Successfully restored ${selected.count()} ${_.lowerFirst(selected.count() === 1
                ? ModelClass.singular()
                : ModelClass.plural()
            )}`);
            refresh();
        } catch (error) {
            createErrorCallback(notify)(error);
        }

    },

    forceDelete: (ModelClass) => async ({ selected, notify, dialog, refresh }) => {

        const confirm = await dialog({
            title: 'Confirm permanent deletion',
            message: `Are you sure you want to delete permanently ${selected.count()} ${_.lowerFirst(selected.count() === 1
                ? ModelClass.singular()
                : ModelClass.plural())}?`,
            type: 'confirm'
        });

        if (!confirm) {
            return;
        }

        try {
            await ModelClass.forceDelete(selected.pluck(ModelClass.getSchema().primaryKey).all());

            notify(`Successfully deleted permanently ${selected.count()} ${_.lowerFirst(selected.count() === 1
                ? ModelClass.singular()
                : ModelClass.plural()
            )}`);
            refresh();
        } catch (error) {
            createErrorCallback(notify)(error);
        }

    },

};



