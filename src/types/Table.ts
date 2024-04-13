
export type Action = {
    label: string;
    callback: () => void;
}

export type MassAction = {
    label: string;
    name: string;
};

export type Column = {
    key: string;
    label: string;
    sortable?: boolean;
};
