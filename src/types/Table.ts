import { TableCellProps } from '@mui/material';

export type Action = {
    label: string;
    callback: () => void;
}

export type MassAction = {
    label: string;
    name: string;
};

export type Column = TableCellProps & {
    key: string;
    label: string;
    sortable?: boolean;
};
