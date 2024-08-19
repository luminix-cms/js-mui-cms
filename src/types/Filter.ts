/* eslint-disable @typescript-eslint/no-explicit-any */

export type FilterColumn = {
    key: string,
    label: string,
    type: string,
    nullable: boolean,
    is_relation: boolean,
}

export type FilteredColumn = {
    key: string,
    operator: string,
    type: string,
    value: any,
    nullable: boolean,
    is_relation: boolean,
}

export type FilterContent = {
    dialog?: boolean, 
}

export type FilterRow = {
    index: number,
    column: FilteredColumn,
}

export type FilterValueInput = {
    index?: number,
}
