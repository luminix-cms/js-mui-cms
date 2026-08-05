import React from 'react';

import { Obj, Str } from '@luminix/support';
import { config } from '@luminix/core';

import { styled } from '@mui/material/styles';

import {
    TableRow as MuiTableRow,
    TableCell,
    Checkbox,
    Typography,
} from '@mui/material';

import useTable from '../../../../hooks/useTable';
import useIsDesktopMode from '../../../../hooks/useIsDesktopMode';
import useSelection from '../../../../hooks/useSelection';
import useCurrentModel from '../../../../hooks/useCurrentModel';
import useActionEvent from '../../../../hooks/useActionEvent';

import { TableRowProps } from '../../../../types/PropTypes';
import Cms from '../../../../facades/Cms';

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
            <CellText>
                {rawContent.toLocaleString(config('app.locale', 'en') as string)}
            </CellText>
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
            <CellText>
                <label>{label}:</label>
                {rawContent.toLocaleString(config('app.locale', 'en') as string)}
            </CellText>
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

    const isDesktop = useIsDesktopMode();
    const actionEvent = useActionEvent();

    const Model = useCurrentModel();

    const { massActions, columns } = useTable();

    const handlers = React.useMemo(() => Cms.getRowClickHandlers(Model, item), [Model, item]);

    const clickable = handlers.length > 0;

    const handleRowClick = (mouseEvent: React.MouseEvent) => {
        handlers.forEach((handler) => handler({ ...actionEvent, item, mouseEvent }));
    };

    const columnsWithContents = React.useMemo(() => columns.map((props) => ({
        ...props,
        content: Cms[`model${Str.studly(item.getType())}Get${Str.studly(props.key)}Content`](Obj.get(item, props.key), item), //
    })), [columns, item]);

    const {
        ['ModelIndex.Table.ShrinkedCell']: ShrinkedCell,
        ['ModelIndex.InstanceActions']: InstanceActions,
    } = Cms.getComponents();

    const {
        isSelected, handleSelectToggle,
    } = useSelection();

    return (
        <MuiTableRow
            {...props}
            sx={{ cursor: clickable ? 'pointer' : 'default' }}
            selected={isSelected(item)}
            hover={clickable}
        >
            {massActions.length > 0 && (
                <ShrinkedCell>
                    <Checkbox 
                        checked={isSelected(item)}
                        onChange={() => handleSelectToggle(item)}
                    />
                </ShrinkedCell>
            )}
            {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
            {isDesktop && columnsWithContents.map(({ key, label, sortable, content, ...props }) => (
                <TableCell
                    key={key}
                    {...props}
                    onClick={clickable ? handleRowClick : undefined}
                >
                    <CellContent
                        label={label}
                        content={content}
                    />
                </TableCell>
            ))}
            {!isDesktop && (
                <TableCell
                    sx={{ maxWidth: 0, px: 0 }}
                    onClick={clickable ? handleRowClick : undefined}
                >
                    {columnsWithContents.map(({ key, ...props }) => <MobileCellContent key={key} {...props} />)}
                </TableCell>
            )}
            <ShrinkedCell>
                <InstanceActions item={item} />
            </ShrinkedCell>
        </MuiTableRow>
    );
};

export default TableRow;