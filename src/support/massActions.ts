import { Model } from "@luminix/core";
import { MassActionCallbackEvent } from "../types/Table";
import { createErrorCallback } from "./error";
import _ from "lodash";



export const massActionHandlers: Record<string, (ModelClass: typeof Model) => (e: MassActionCallbackEvent) => void> = {

    delete: (ModelClass) => async ({ selected, notify, dialog, refresh, t }) => {

        const action = ModelClass.getSchema().softDeletes
            ? 'send to trash'
            : 'delete permanently';

        const afterMath = ModelClass.getSchema().softDeletes
            ? 'sent to trash'
            : 'deleted';

        const confirm = await dialog({
            title: ModelClass.getSchema().softDeletes
                ? t('Confirm send to trash')
                : t('Confirm delete permanently'),
            message: t(`Are you sure you want to ${action} :count :model?`, {
                count: selected.count(),
                model: _.lowerFirst(selected.count() === 1
                    ? ModelClass.singular()
                    : ModelClass.plural())
            }),
            type: 'confirm'
        });

        if (!confirm) {
            return;
        }

        try {
            await ModelClass.delete(selected.pluck(ModelClass.getSchema().primaryKey).all());

            notify(t(`Successfully ${afterMath} :count :model`, {
                count: selected.count(),
                model: _.lowerFirst(selected.count() === 1
                    ? ModelClass.singular()
                    : ModelClass.plural())
            }));

            refresh();
        } catch (error) {
            createErrorCallback(notify)(error);
        }
    },


    restore: (ModelClass) => async ({ selected, notify, dialog, refresh, t }) => {
        const confirm = await dialog({
            title: t('Confirm restore'),
            message: t('Are you sure you want to restore :count :model?', {
                count: selected.count(),
                model: _.lowerFirst(selected.count() === 1
                    ? ModelClass.singular()
                    : ModelClass.plural())
            }),
            type: 'confirm'
        });

        if (!confirm) {
            return;
        }

        try {
            await ModelClass.restore(selected.pluck(ModelClass.getSchema().primaryKey).all());

            notify(t('Successfully restored :count :model', {
                count: selected.count(),
                model: _.lowerFirst(selected.count() === 1
                    ? ModelClass.singular()
                    : ModelClass.plural())
            }));

            refresh();
        } catch (error) {
            createErrorCallback(notify)(error);
        }

    },

    forceDelete: (ModelClass) => async ({ selected, notify, dialog, refresh, t }) => {

        const confirm = await dialog({
            title: t('Confirm permanent deletion'),
            message: t('Are you sure you want to delete permanently :count :model?', {
                count: selected.count(),
                model: _.lowerFirst(selected.count() === 1
                    ? ModelClass.singular()
                    : ModelClass.plural())
            }),
            type: 'confirm'
        });

        if (!confirm) {
            return;
        }

        try {
            await ModelClass.forceDelete(selected.pluck(ModelClass.getSchema().primaryKey).all());

            notify(t('Successfully deleted :count :model', {
                count: selected.count(),
                model: _.lowerFirst(selected.count() === 1
                    ? ModelClass.singular()
                    : ModelClass.plural())
            }));

            refresh();
        } catch (error) {
            createErrorCallback(notify)(error);
        }

    },

};



