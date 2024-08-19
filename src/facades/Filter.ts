/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from "lodash";

import { Model, Reducible, config } from "@luminix/core";
import { ReducerCallback } from "@luminix/core/dist/types/Reducer";

import { InputOption } from "../types/PropTypes";
import { FilterColumn, FilteredColumn } from "../types/Filter";

import { isSet } from "../support/misc";

class FilterFacade {

    [key: string]: ReducerCallback;

    getInputType(type: string): string
    {
        switch (type) {
            case 'int':
            case 'float':
            case 'number': return 'number';
            //
            case 'date': return 'date';
            //
            case 'datetime': 
            case 'timestamp': return 'datetime-local';
            //
            case 'autocomplete': return 'autocomplete';
            //
            case 'bool':
            case 'boolean': return 'boolean';
            //
            default: return 'text';
        }
    }

    getOperators(): string[]
    {
        return config('luminix.admin.filter.operators') as string[];
    }

    getMatchingOperators(column: FilterColumn): InputOption[]
    {
        return this.getOperators()
            .filter((operator) => {
                if (!column.is_relation) {
                    if ([ 'relation' ].includes(operator)) {
                        return false;
                    }
                }

                if ([ 'text' ].includes(this.getInputType(column.type))) {
                    if ([ 
                        'greaterThan', 'greaterThanOrEquals', 
                        'lessThan', 'lessThanOrEquals', 
                        'between', 'notBetween',
                    ].includes(operator)) {
                        return false;
                    }
                }
                if ([ 'number', 'date', 'datetime-local', 'boolean' ].includes(this.getInputType(column.type))) {
                    if ([ 'like' ].includes(operator)) {
                        return false;
                    }
                }

                if (!column.nullable) {
                    if ([ 'null', 'notNull' ].includes(operator)) {
                        return false;
                    }
                }

                return operator;
            })
            .map((operator) => {

                let label = operator;

                switch (operator) {
                    case 'equals': label = '='; break;
                    case 'notEquals': label = '!='; break;
                    case 'greaterThan': label = '>'; break;
                    case 'greaterThanOrEquals': label = '>='; break;
                    case 'lessThan': label = '<'; break;
                    case 'lessThanOrEquals': label = '<='; break;
                    //
                    default: label = _.startCase(label); break;
                }

                return {
                    key: operator,
                    label,
                };
            });
    }

    getFilterableColumns(ModelClass: typeof Model): FilterColumn[]
    {
        const { attributes = [], relations = {} } = ModelClass.getSchema();

        return [
            ...attributes.filter((attribute) => {
                return !attribute.hidden && !attribute.appended;
            })
                .map((attribute) => {
        
                    let type = attribute.phpType ?? 'string';
        
                    if (!_.isNull(attribute.cast) && !_.isEmpty(attribute.cast)) {
                        type = attribute.cast;
                    }
        
                    return {
                        key: attribute.name,
                        label: _.startCase(attribute.name),
                        type,
                        nullable: attribute.nullable,
                        is_relation: false,
                    };
                }),
            // TODO: review typing of 'acc' 
            ...Object.entries(relations ?? {}).reduce((acc, [ key ]) => {
                return [
                    ...acc,
                    {
                        key: key,
                        label: _.startCase(key),
                        type: 'autocomplete',
                        nullable: false,
                        is_relation: true,
                    }
                ]
            }, [] as FilterColumn[]),
        ];
    }

    checkIfCanApplyFilters(columnsFilter: FilteredColumn[]): boolean
    {
        if (columnsFilter.length === 0) {
            return true;
        }

        const validatedSelectors = columnsFilter.map((column) => {
            if (!isSet(column.key)) {
                return true;
            }

            if (!isSet(column.operator)) {
                return true;
            }

            if ([ 'boolean' ].includes(this.getInputType(column.type))) {
                if (_.isUndefined(column.value) || _.isNull(column.value)) {
                    return true;
                }
            } else if (!isSet(column.value)) {
                return true;
            }

            if (Array.isArray(column.value)) {
                if ([ 'between', 'notBetween' ].includes(column.operator)) {
                    if (!isSet(column.value[0]) || !isSet(column.value[1])) {
                        return true;
                    }
                }
            }

            return false;
        });

        if (validatedSelectors.includes(true)) {
            return true;
        }
        return false;
    }

}

export default Reducible(FilterFacade);