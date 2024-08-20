
import React from 'react';
import { app } from '@luminix/core';
import { useSearchParams } from 'react-router-dom';

import {
    Box,
    TableHead as MuiTableHead,
    TableRow,
    TableCell,
    Checkbox,
    TableSortLabel,
} from '@mui/material';

import useTable from '../../../hooks/useTable';
import { TableHeadProps } from '../../../types/PropTypes';
import useIsDesktopMode from '../../../hooks/useIsDesktopMode';
import useSelection from '../../../hooks/useSelection';

const TableHead: React.FunctionComponent<TableHeadProps> = ({ children, ...props}) => {

    const {
        massActions, columns, items
    } = useTable();

    const isDesktop = useIsDesktopMode();

    const [searchParams, setSearchParams] = useSearchParams();

    const {
        indeterminate, allSelected, handleSelectToggleAll,
    } = useSelection();

    const {
        ['ModelIndex.Table.ShrinkedCell']: ShrinkedCell,
    } = app('cms').getComponents();

    const currentSort = searchParams.get('order_by') || '';

    const [column, direction] = currentSort.split(':');

    const handleSort = (key: string) => () => {

        if (column === key) {
            // query.orderBy(key, direction === 'asc' ? 'desc' : 'asc');
            setSearchParams((params) => {
                const newSearch = new URLSearchParams(params);
                if (!direction) {
                    newSearch.set('order_by', `${key}:asc`);
                    return newSearch;
                }
                if (direction === 'desc') {
                    newSearch.delete('order_by');
                    return newSearch;
                }
                newSearch.set('order_by', `${key}:desc`);
                return newSearch;
            });
        } else {
            // query.orderBy(key, 'asc');
            setSearchParams((params) => {
                const newSearch = new URLSearchParams(params);

                newSearch.set('order_by', `${key}:asc`);
                return newSearch;
            });
        }
    };

    return (
        <MuiTableHead {...props}>
            {children}
            {isDesktop && (
                <TableRow>
                    {massActions.length > 0 && (
                        <ShrinkedCell>
                            <Checkbox
                                indeterminate={indeterminate}
                                checked={allSelected}
                                onChange={handleSelectToggleAll}
                                disabled={items && items.count() === 0}
                            />
                        </ShrinkedCell>
                    )}
                    {columns.map(({ key, label, sortable = true, ...props }) => (
                        <TableCell
                            key={key}
                            // sx={{
                            //     cursor: sortable ? 'pointer' : 'default',
                            // }}
                            
                            sortDirection={sortable && column === key && (direction as 'asc' | 'desc' | undefined) || false}
                            {...props}
                        >
                            <TableSortLabel
                                active={sortable && column === key}
                                direction={direction as 'asc' | 'desc' }
                                onClick={handleSort(key)}
                            >
                                {label}
                                {(sortable && column === key) ? (
                                    <Box component="span" sx={{ visibility: 'hidden', display: 'none' }}>
                                        {direction === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                    <ShrinkedCell></ShrinkedCell>
                </TableRow>
            )}
        </MuiTableHead>
    );
};

export default TableHead;