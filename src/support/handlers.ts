import { Model } from "@luminix/core";
import { ActionCallbackEvent, InstanceActionCallbackEvent, MassActionCallbackEvent } from "../types/Table";
import { createErrorCallback } from "./error";
import _ from "lodash";

type MassActionHandlers = Record<string, (ModelClass: typeof Model) => (e: MassActionCallbackEvent) => void>;
type InstanceActionHandlers = Record<string, (ModelClass: typeof Model) => (e: InstanceActionCallbackEvent) => void>;
type StaticActionHandlers = Record<string, (ModelClass: typeof Model) => (e: ActionCallbackEvent) => void>;

export const massActionHandlers: MassActionHandlers = {

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

export const instanceActionHandlers: InstanceActionHandlers = {
    
    delete: (ModelClass) => async ({ item, notify, dialog, refresh, t }) => {

        const action = ModelClass.getSchema().softDeletes
            ? 'send :model “:label” to trash'
            : 'delete :model “:label” permanently';

        const afterMath = ModelClass.getSchema().softDeletes
            ? 'sent to trash'
            : 'deleted';

        const confirm = await dialog({
            title: ModelClass.getSchema().softDeletes
                ? t('Confirm send to trash')
                : t('Confirm delete permanently'),
            message: t(`Are you sure you want to ${action}?`, {
                model: _.lowerFirst(ModelClass.singular()),
                label: item.getLabel(),
            }),
            type: 'confirm'
        });

        if (!confirm) {
            return;
        }

        try {
            await item.delete();

            notify(t(`Successfully ${afterMath} :model`, {
                model: _.lowerFirst(ModelClass.singular())
            }));

            refresh();
        } catch (error) {
            createErrorCallback(notify)(error);
        }
    },

    restore: (ModelClass) => async ({ item, notify, dialog, refresh, t }) => {

        const confirm = await dialog({
            title: t('Confirm restore'),
            message: t('Are you sure you want to restore :model?', {
                model: _.lowerFirst(ModelClass.singular())
            }),
            type: 'confirm'
        });

        if (!confirm) {
            return;
        }

        try {
            await item.restore();

            notify(t('Successfully restored :model', {
                model: _.lowerFirst(ModelClass.singular())
            }));

            refresh();
        } catch (error) {
            createErrorCallback(notify)(error);
        }
    },

    forceDelete: (ModelClass) => async ({ item, notify, dialog, refresh, t }) => {

        const confirm = await dialog({
            title: t('Confirm permanent deletion'),
            message: t('Are you sure you want to delete :model “:label” permanently ?', {
                model: _.lowerFirst(ModelClass.singular()),
                label: item.getLabel(),
            }),
            type: 'confirm'
        });

        if (!confirm) {
            return;
        }

        try {
            await item.forceDelete();

            notify(t('Successfully deleted :model', {
                model: _.lowerFirst(ModelClass.singular())
            }));

            refresh();
        } catch (error) {
            createErrorCallback(notify)(error);
        }
    },
};

export const staticActionHandlers: StaticActionHandlers = {


    create: (ModelClass) => ({ navigate }) => {
        navigate(`/${_.kebabCase(ModelClass.plural())}/create`);
    },

};



