import React from 'react';

import { TableProps } from '../../types/PropTypes';

import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import _ from 'lodash';
import { useApplyReducers } from '@luminix/react';
import { app } from '@luminix/core';
import useIsDesktopMode from '../../hooks/useIsDesktopMode';

type MassAction = {
    label: string;
    name: string;
};

type Column = {
    key: string;
    label: string;
};

const DEFAULT_MASS_ACTIONS = [
    {
        label: 'Delete',
        name: 'delete',
    },
];

const Table: React.FunctionComponent<TableProps> = ({ items, Model }) => {

    const isDesktop = useIsDesktopMode();

    const DEFAULT_COLUMNS = React.useMemo(() => [
        {
            key: Model.getSchema().labeledBy,
            label: _.upperFirst(_.camelCase(Model.getSchema().labeledBy)),
        }
    ], [Model]);

    const columns = useApplyReducers(
        app('cms'),
        `model${_.upperFirst(_.camelCase(Model.getSchemaName()))}Columns`,
        DEFAULT_COLUMNS
    ) as Column[];

    const massActions = useApplyReducers(
        app('cms'),
        `model${_.upperFirst(_.camelCase(Model.getSchemaName()))}MassActions`,
        DEFAULT_MASS_ACTIONS
    ) as MassAction[];

    const dataColumns = isDesktop
        ? columns.length
        : 1;

    const columnCount = massActions.length === 0
        ? dataColumns + 1
        : dataColumns + 2;

    return (
        <TableContainer component={Paper}>
            <MuiTable>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox />
                        </TableCell>
                        <TableCell>
                            {_.upperFirst(Model.getSchema().labeledBy)}
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map(item => (
                        <TableRow key={item.id}>
                            <TableCell
                                padding="checkbox"
                                sx={{ width: '1px' }}
                            >
                                <Checkbox />
                            </TableCell>
                            <TableCell>
                                {item[Model.getSchema().labeledBy]}
                            </TableCell>
                            <TableCell sx={{ width: '1px' }}>
                                <IconButton>
                                    <MoreVertIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                {/* <TableFooter>
                    <TableRow>
                        <TableCell colSpan={Model.fields.length} align="right">
                            {items.length} items
                        </TableCell>
                    </TableRow>
                </TableFooter> */}
            </MuiTable>

        </TableContainer>
    );
};

export default Table;






