import React from 'react';
import { Model, app, collect } from '@luminix/core';
import { CollectionIteratorCallback } from '@luminix/core/dist/types/Collection';
import { useTranslation } from 'react-i18next';

import {
    TableBody as MuiTableBody,
    TableRow,
    TableCell,
    Typography,
} from '@mui/material';

import Skeleton from './TableBody/Skeleton';

import useTable from '../../../hooks/useTable';
import { TableBodyProps } from '../../../types/PropTypes';
import useCurrentModel from '../../../hooks/useCurrentModel';

const TableBody: React.FunctionComponent<TableBodyProps> = ({ children, ...props }) => {

    const Model = useCurrentModel();
    const { t } = useTranslation();

    const {
        items, loading, columnCount,
    } = useTable();

    const {

        ['ModelIndex.StaticActions']: StaticActions,
    } = app('cms').getComponents();

    const renderedChildren = React.isValidElement(children) 
        ? children 
        : (items || collect([])).map(children as CollectionIteratorCallback<Model, React.ReactNode>);

    return (
        <MuiTableBody {...props}>
            {loading && <Skeleton />}
            {renderedChildren}
            {items && !items.count() && (
                <TableRow>
                    <TableCell colSpan={columnCount} sx={{ textAlign: 'center', py: 10 }}>
                        <Typography>
                            {t('No :model found', {
                                model: Model.plural().toLocaleLowerCase()
                            })}
                        </Typography>
                        <br />
                        <StaticActions />
                    </TableCell>
                </TableRow>
            )}
        </MuiTableBody>
    );

};


export default TableBody;