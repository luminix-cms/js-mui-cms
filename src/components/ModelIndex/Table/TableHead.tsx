
import React from 'react';
import { app } from '@luminix/core';

import Box from '@mui/material/Box';
import MuiTableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import TableSortLabel from '@mui/material/TableSortLabel';

import useTable from '../../../hooks/useTable';
import { TableHeadProps } from '../../../types/PropTypes';
import useIsDesktopMode from '../../../hooks/useIsDesktopMode';
import { useSearchParams } from 'react-router-dom';

const TableHead: React.FunctionComponent<TableHeadProps> = ({ children, ...props}) => {

    const {
        massActions, columns
    } = useTable();

    const isDesktop = useIsDesktopMode();

    const [searchParams, setSearchParams] = useSearchParams();

    const {
        ['ModelIndex.Table.ShrinkedCell']: ShrinkedCell,
    } = app('cms').getComponents();

    const currentSort = searchParams.get('order_by') || '';

    const [column, direction] = currentSort.split(':');

    console.log('sorting:', column, direction);

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
                            <Checkbox />
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