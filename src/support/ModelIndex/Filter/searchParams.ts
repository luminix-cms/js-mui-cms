/* eslint-disable @typescript-eslint/no-explicit-any */
import { DateTime, Obj, Query } from '@luminix/support';
import { app } from '@luminix/core';

import { FilterColumn, FilteredColumn } from '../../../types/Filter';




/**
 * Translates the received parameters object from url 'searchParams', 
 * into an array of FilteredColumn objects.
 * 
 * @param {string} operation
 * @param {any} value
 * @returns 
 */
export function translateColumnsFromQuery(columns: FilterColumn[], searchParams: any): FilteredColumn[] {

    // const FilterFacade = app('filter');

    // const params = Query.toObject(searchParams);

    // const queryObject = Object.keys(params).reduce((acc: any, key) => {
    //     if ([ 'where' ].includes(key)) {
    //         acc[key] = params[key];
    //     }
    //     return acc;
    // }, {});

    // const filteredColumns: FilteredColumn[] = [];

    // // TODO: review typing of forEach parameter
    // Object.entries(queryObject).forEach(([, params]: any) => {
    //     // TODO: review typing of forEach parameter 
    //     Object.entries(params).forEach(([operation, value]: any) => {
    //         columns.filter((column) => {

    //             const operator = (() => {
    //                 const op = Str.camel(operation.split(Str.camel(column.key))[1]);

    //                 if (Obj.isEmpty(op)) {
    //                     return 'equals';
    //                 }
    //                 return op;
    //             })();

    //             if (!FilterFacade.getOperators().includes(operator)) {
    //                 return false;
    //             }

    //             const attribute = Str.snake(operation.split(Str.ucfirst(operator))[0]);

    //             return column.key === attribute;
    //         })
    //             .forEach((column) => {

    //                 let operator = Str.camel(operation.split(Str.camel(column.key))[1]);

    //                 if (typeof operator === 'undefined' || operator === null || Obj.isEmpty(operator)) {
    //                     operator = 'equals';
    //                 }

    //                 let _value = value;
    
    //                 switch (FilterFacade.getInputType(column.type)) {
    //                     case 'text': {
    //                         if (Array.isArray(value)) {
    //                             _value = value.join(',');
    //                         }
    //                         break;
    //                     }
    //                     case 'datetime-local': {
    //                         if (Array.isArray(value)) {
    //                             _value = value.map((v) => DateTime.toDateTimeLocal(v));
    //                         } else {
    //                             _value = DateTime.toDateTimeLocal(value);
    //                         }

    //                         break;
    //                     }
    //                     case 'boolean': {
    //                         _value = Number(value);
    //                         break;
    //                     }
    //                 }
                    
    //                 filteredColumns.push({
    //                     key: column.key, 
    //                     operator, 
    //                     type: column.type, 
    //                     value: _value, 
    //                     nullable: column.nullable,
    //                     is_relation: column.is_relation, 
    //                 });
    //             });
    //     });
    // });
            
    // return filteredColumns;

    const filteredColumns: FilteredColumn[] = [];
    const queryObject = Query.toObject(searchParams);

    if (!('where' in queryObject) || Obj.isEmpty(queryObject.where)) {
        return [];
    }

    Object.entries(queryObject.where).forEach(([key, value]: any) => {

        // eslint-disable-next-line prefer-const
        let [attribute, operator = 'equals'] = key.split(':');

        const column = columns.find((column) => column.key === attribute);

        if (!column) {
            return;
        }

        if (operator === 'equals' && column.is_relation) {
            operator = 'relation';
        }

        let _value = value;

        switch (column.type) {
            case 'text': {
                if (Array.isArray(value)) {
                    _value = value.join(',');
                }
                break;
            }
            case 'datetime-local': {
                if (Array.isArray(value)) {
                    _value = value.map((v) => DateTime.toDateTimeLocal(v));
                } else {
                    _value = DateTime.toDateTimeLocal(value);
                }

                break;
            }
            case 'boolean': {
                _value = Number(value);
                break;
            }
        }

        filteredColumns.push({
            key: column.key, 
            operator, 
            type: column.type, 
            value: _value, 
            nullable: column.nullable,
            is_relation: column.is_relation, 
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

    const FilterFacade = app('filter');

    const searchParams = new URLSearchParams();

    columns.forEach((column: FilteredColumn) => {

        const { key, operator, value, type } = column;

        let operation = `:${operator}`;//Str.ucfirst(operator);

        if ([ 'equals' ].includes(operator)) {
            operation = '';
        }

        if (Array.isArray(value)) {
            value.forEach((v, i) => {

                let _value = v;

                switch (FilterFacade.getInputType(type)) {
                    case 'datetime-local': {
                        _value = new Date(v).toISOString();
                        break;
                    }
                }

                searchParams.set(`where[${key}${operation}][${i}]`, _value);
            });
        } else {
            
            let _value = value;

            switch (FilterFacade.getInputType(type)) {
                case 'datetime-local': {
                    _value = new Date(value).toISOString();
                    break;
                }
            }

            searchParams.set(`where[${key}${operation}]`, _value);
        }
    });

    return searchParams;
}
