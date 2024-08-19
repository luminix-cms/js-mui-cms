/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from 'lodash';

import { model, Model } from '@luminix/core';

export const changeValueFromArray = (input: any): any =>
{
    if (!Array.isArray(input)) {
        return input;
    }

    let output: any;
    
    if (_.isEmpty(input)) {
        output = '';
    } else {
        output = input[0];
    }

    return output;
};

export const changeValueToArray = (input: any): any =>
{
    if (Array.isArray(input)) {
        return input;
    }

    let output: any;

    if (_.isEmpty(input)) {
        output = [];
    } else {
        output = [input, ''];
    }

    return output;
};

export const mountRelationModelOption = async (
    ModelClass: typeof Model, 
    key: string, 
    input: string[] | number[], 
): Promise<Model[]> => {
        
    const relation = ModelClass.getSchema().relations[key];

    const RelatedModel = model().make(relation.model);

    const primaryKey = RelatedModel.getSchema().primaryKey;

    const output: Model[] = [];

    for (const value of input) {

        const { data } = await RelatedModel.where(primaryKey, value).get();
        
        output.push(data.first() as Model);
    }

    return output;
};
