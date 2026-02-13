/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';

import { app } from '@luminix/core';

import { SelectChangeEvent } from '@mui/material';

import ModelFilterContext from '../../../contexts/ModelFilterContext';

import { FilterColumn, FilteredColumn } from "../../../types/Filter";

import { changeValueFromArray, changeValueToArray } from "../../../support/ModelIndex/Filter/inputs";

export default function useRow( index: number, column: FilteredColumn ) {

    const FilterFacade = app('filter');

    const { Model, setColumnsFilter } = React.useContext(ModelFilterContext);

    const [key, setKey] = React.useState(column.key);
    const [operator, setOperator] = React.useState(column.operator);
    const [type, setType] = React.useState(column.type);
    const [value, setValue] = React.useState(column.value);
    
    const [nullable, setNullable] = React.useState(column.nullable);
    const [isRelation, setIsRelation] = React.useState(column.is_relation);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const columns: FilterColumn[] = React.useMemo(() => FilterFacade.getFilterableColumns(Model), [Model]);

    const handleRemoveColumn = (index: number) => () => {
        setColumnsFilter((prev: FilteredColumn[]) => prev.filter((_item, i: number) => i !== index));
    };

    const handleKey = async (event: SelectChangeEvent<string>) => {
        
        const newKey = event.target.value;
        const befittingColumn = columns.find((c) => c.key === newKey);
        const newType = befittingColumn?.type ?? 'text';

        const is_nullable = befittingColumn?.nullable ?? false;
        const is_relation = befittingColumn?.is_relation ?? false;

        setOperator(
            FilterFacade.getMatchingOperators(befittingColumn)[0]?.key ?? 'equals'
        );

        if (is_relation) {
            setValue([]);
        }

        setIsRelation(is_relation);
        setNullable(is_nullable);

        if (newType !== type) {

            setValue(() => {
                if ([ 'between', 'notBetween' ].includes(operator)) {
                    return [];
                }

                switch (FilterFacade.getInputType(newType)) {
                    case 'number': {
                        return 0; 
                    }
                    case 'boolean': {
                        return 0;
                    }
                    //
                    default: return '';
                }
            });
        }

        setKey(newKey);
        setType(newType);
    };

    const handleOperator = async (event: SelectChangeEvent<string>) => {
        
        const newOperator = event.target.value;

        if (operator !== newOperator) {
            setValue((prev: any) => {
                switch (newOperator) {
                    case 'between': 
                    case 'notBetween': {
                        return changeValueToArray(prev);
                    }
                    case 'null':
                    case 'notNull': {
                        return '1';
                    }
                    //
                    default: {
                        return changeValueFromArray(prev);
                    }
                }
            });
        }

        setOperator(newOperator);
    };

    React.useEffect(() => {
        // console.log('will update row...');
        
        setColumnsFilter((prev: FilteredColumn[]) => {
            const newColumns = prev.map((column: FilteredColumn, columnIndex: number) => {
                if (index === columnIndex) {
                    return {
                        ...column,
                        key,
                        operator,
                        type,
                        value,
                        nullable,
                        is_relation: isRelation,
                    };
                }
                return column;
            });

            return newColumns;
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ key, operator, type, value, nullable, isRelation ]);

    return {
        columns, 
        key, setKey,
        operator, setOperator,
        type, setType,
        value, setValue,
        nullable, setNullable,
        isRelation, setIsRelation,
        handleKey,
        handleOperator,
        handleRemoveColumn,
    };
}