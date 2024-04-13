import React from 'react';
import { app } from '@luminix/core';

import MuiTableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import _ from 'lodash';

import useTable from '../../../../hooks/useTable';
import { TableRowProps } from '../../../../types/PropTypes';
import useIsDesktopMode from '../../../../hooks/useIsDesktopMode';

type MobileCellContentProps = {
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any;
};

const CellContent: React.FunctionComponent<MobileCellContentProps> = ({ content: rawContent }) => {
    if (['string', 'number'].includes(typeof rawContent)) {
        return (
            <Typography>{rawContent}</Typography>
        );
    }

    if (rawContent instanceof Date) {
        return (
            <Typography>{rawContent.toLocaleString()}</Typography>
        );
    }

    if (typeof rawContent === 'object' && !React.isValidElement(rawContent)) {
        return (
            <Typography>{JSON.stringify(rawContent)}</Typography>
        );
    }

    return (
        <React.Fragment>
            {rawContent}
        </React.Fragment>
    );
}

const MobileCellContent: React.FunctionComponent<MobileCellContentProps> = ({ label, content: rawContent }) => {
                        
    if (['string', 'number'].includes(typeof rawContent)) {
        return (
            <Typography><b>{label}:</b> {rawContent}</Typography>
        );
    }

    if (rawContent instanceof Date) {
        return (
            <Typography><b>{label}:</b> {rawContent.toLocaleString()}</Typography>
        );
    }

    if (typeof rawContent === 'object' && !React.isValidElement(rawContent)) {
        return (
            <Typography><b>{label}:</b> {JSON.stringify(rawContent)}</Typography>
        );
    }

    return (
        <React.Fragment>
            <Typography sx={{ display: 'inline' }}><b>{label}:</b></Typography>{' '}{rawContent}
        </React.Fragment>
    );
};


const TableRow: React.FunctionComponent<TableRowProps> = ({ item, ...props }) => {

    const {
        massActions, columns,
    } = useTable();

    const columnsWithContents = React.useMemo(() => columns.map(({ key, label }) => ({
        key,
        label,
        content: app('cms')[`model${item.constructor.name}Get${_.upperFirst(_.camelCase(key))}Content`](item.getAttribute(key), item),
    })), [columns, item]);

    const {
        ['ModelIndex.Table.ShrinkedCell']: ShrinkedCell,
    } = app('cms').getComponents();

    const isDesktop = useIsDesktopMode();

    return (
        <MuiTableRow {...props}>
            {massActions.length > 0 && (
                <ShrinkedCell>
                    <Checkbox />
                </ShrinkedCell>
            )}
            {isDesktop && columnsWithContents.map(({ key, ...props }) => (
                <TableCell key={key}>
                    <CellContent {...props} />
                </TableCell>
            ))}
            {!isDesktop && (
                <TableCell>
                    {columnsWithContents.map(({ key, ...props }) => <MobileCellContent key={key} {...props} />)}
                </TableCell>
            )}
            <ShrinkedCell>
                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            </ShrinkedCell>
        </MuiTableRow>
    );
};

export default TableRow;