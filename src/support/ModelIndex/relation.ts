/* eslint-disable @typescript-eslint/no-explicit-any */

import { Model, model, collect } from "@luminix/core";
import { Collection } from "@luminix/core/dist/types/Collection";

export const loadRelationOptions = async (
    ModelClass: typeof Model, 
    key: string
): Promise<Collection<Model>> => {

    const relation = ModelClass.getSchema().relations[key].model;

    const { data } = await model().make(relation).get();

    return data;
};

export const aggregateRelationOptions = async (
    ModelClass: typeof Model, 
    key: string, 
    term: string = '', 
    loadedOptions: Collection<Model>, 
): Promise<Collection<Model>> => {

    const relation = ModelClass.getSchema().relations[key];

    const RelatedModel = model().make(relation.model);

    const primaryKey = RelatedModel.getSchema().primaryKey;

    const { data } = await RelatedModel
        .searchBy(term)
        .get();

    const uniqueCollection = collect([...loadedOptions, ...data]).unique(primaryKey);
        
    return uniqueCollection;
}
