/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from 'lodash';

import { app } from '@luminix/core';

import { FilterColumn, FilteredColumn } from '../../../types/Filter';

import { searchParamsToObject } from '../../searchParams';

/**
 * Translates the received parameters object from url 'searchParams', 
 * into an array of FilteredColumn objects.
 * 
 * @param {string} operation
 * @param {any} value
 * @returns 
 */
export const translateColumnsFromQuery = (columns: FilterColumn[], searchParams: any) => {

    const FilterFacade = app('filter');

    const params = searchParamsToObject(searchParams);

    const queryObject = Object.keys(params).reduce((acc: any, key) => {
        if ([ 'where' ].includes(key)) {
            acc[key] = params[key];
        }
        return acc;
    }, {});

    const filteredColumns: FilteredColumn[] = [];

    // TODO: review typing of forEach parameter
    Object.entries(queryObject).forEach(([, params]: any) => {
        // TODO: review typing of forEach parameter 
        Object.entries(params).forEach(([operation, value]: any) => {
            columns.filter((column) => {

                const operator = (() => {
                    const op = _.camelCase(operation.split(_.camelCase(column.key))[1]);

                    if (_.isEmpty(op)) {
                        return 'equals';
                    }
                    return op;
                })();

                if (!FilterFacade.getOperators().includes(operator)) {
                    return false;
                }

                const attribute = _.snakeCase(operation.split(_.upperFirst(operator))[0]);

                return column.key === attribute;
            })
                .forEach((column) => {

                    let operator = _.camelCase(operation.split(_.camelCase(column.key))[1]);

                    if (_.isUndefined(operator) || _.isNull(operator) || _.isEmpty(operator)) {
                        operator = 'equals';
                    }

                    let _value = value;
    
                    switch (FilterFacade.getInputType(column.type)) {
                        case 'text': {
                            if (Array.isArray(value)) {
                                _value = value.join(',');
                            }
                            break;
                        }
                        case 'boolean': {
                            _value = _.toNumber(value);
                            break;
                        }
                    }
                    
                    filteredColumns.push({
                        key: column.key, 
                        operator, 
                        type: column.type, 
                        value: _value, 
                        is_relation: column.is_relation, 
                    });
                });
        });
    });
            
    return filteredColumns;
}

/**
 * Translates the selected columns to filter, 
 * into a url 'searchParams'.
 * 
 * @param {FilterColumn[]} columns
 * @returns 
 */
export const translateColumnsToQuery = (columns: FilteredColumn[]) => {

    const searchParams = new URLSearchParams();

    columns.forEach((column: FilteredColumn) => {

        const { key, operator, value } = column;

        let operation = _.upperFirst(operator);

        if ([ 'equals' ].includes(operation.toLowerCase())) {
            operation = '';
        }

        if (Array.isArray(value)) {
            value.forEach((v, i) => {
                searchParams.set(`where[${_.camelCase(key)}${operation}][${i}]`, v);
            });
        } else {
            searchParams.set(`where[${_.camelCase(key)}${operation}]`, value);
        }
    });

    return searchParams;
}
