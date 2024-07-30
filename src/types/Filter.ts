/* eslint-disable @typescript-eslint/no-explicit-any */

export type FilterColumn = {
    key: string,
    label: string,
    type: string,
    is_relation: boolean,
}

export type FilteredColumn = {
    key: string,
    operator: string,
    type: string,
    value: any,
    is_relation: boolean,
}

export type FilterRow = {
    index: number,
    column: FilteredColumn,
}

export type FilterValueInput = {
    index?: number,
}
