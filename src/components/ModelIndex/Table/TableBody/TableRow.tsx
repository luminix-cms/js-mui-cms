import React from 'react';
import { app } from '@luminix/core';

import { styled } from '@mui/material/styles';

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

const CellText = styled(Typography)(() => ({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '& label': {
        fontWeight: 'bold',
    },
}));

const CellContent: React.FunctionComponent<MobileCellContentProps> = ({ content: rawContent }) => {
    if (['string', 'number'].includes(typeof rawContent)) {
        return (
            <CellText>{rawContent}</CellText>
        );
    }

    if (rawContent instanceof Date) {
        return (
            <CellText>{rawContent.toLocaleString()}</CellText>
        );
    }

    if (typeof rawContent === 'object' && !React.isValidElement(rawContent)) {
        return (
            <CellText>{JSON.stringify(rawContent)}</CellText>
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
            <CellText><label>{label}:</label> {rawContent}</CellText>
        );
    }

    if (rawContent instanceof Date) {
        return (
            <CellText><label>{label}:</label> {rawContent.toLocaleString()}</CellText>
        );
    }

    if (typeof rawContent === 'object' && !React.isValidElement(rawContent)) {
        return (
            <CellText><label>{label}:</label> {JSON.stringify(rawContent)}</CellText>
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

    const columnsWithContents = React.useMemo(() => columns.map((props) => ({
        ...props,
        content: app('cms')[`model${item.constructor.name}Get${_.upperFirst(_.camelCase(props.key))}Content`](item.getAttribute(props.key), item),
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
            {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
            {isDesktop && columnsWithContents.map(({ key, label, sortable, content, ...props }) => (
                <TableCell key={key} {...props}>
                    <CellContent
                        label={label}
                        content={content}
                    />
                </TableCell>
            ))}
            {!isDesktop && (
                <TableCell sx={{ maxWidth: 0 }}>
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