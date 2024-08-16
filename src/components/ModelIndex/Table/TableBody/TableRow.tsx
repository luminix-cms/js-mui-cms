/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from 'lodash';

import React from 'react';
import { useNavigate } from 'react-router-dom';

import { app, config } from '@luminix/core';
import { useApplyReducers, usePagination } from '@luminix/react';

import useTable from '../../../../hooks/useTable';
import useIsDesktopMode from '../../../../hooks/useIsDesktopMode';
import useSelection from '../../../../hooks/useSelection';
import useCurrentModel from '../../../../hooks/useCurrentModel';
import useNotifications from '../../../../hooks/useNotifications';
import useDialog from '../../../../hooks/useDialog';

import { styled } from '@mui/material/styles';
import MuiTableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';

import { TableRowProps } from '../../../../types/PropTypes';
import { StaticAction } from '../../../../types/Table';

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
    const navigate = useNavigate();

    const Model = useCurrentModel();

    const dialog = useDialog();

    const { massActions, columns } = useTable();

    const { refresh } = usePagination();
    const { notify } = useNotifications();

    const columnsWithContents = React.useMemo(() => columns.map((props) => ({
        ...props,
        content: app('cms')[`model${item.constructor.name}Get${_.upperFirst(_.camelCase(props.key))}Content`](item.getAttribute(props.key), item),
    })), [columns, item]);

    const {
        ['ModelIndex.Table.ShrinkedCell']: ShrinkedCell,
        ['ModelIndex.InstanceActions']: InstanceActions,
    } = app('cms').getComponents();

    // const DEFAULT_ACTIONS = React.useMemo(() => [
    //     {
    //         label: `Delete ${Model.singular()}`,
    //         callback: async () => {
    //             const confirm = await dialog({
    //                 title: 'Confirm permanent deletion',
    //                 message: `Are you sure you want to ${Model.getSchema().softDeletes ? 'send to trash' : 'delete permanently'} ${Model.singular()}?`,
    //                 type: 'confirm'
    //             });

    //             if (!confirm) {
    //                 return;
    //             }

    //             item.delete().then(() => {
    //                 notify(`${Model.singular()} deleted successfully`);
    //                 refresh();
    //             });
    //         },
    //         icon: <DeleteIcon />,
    //     },
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // ], [Model]);

    // const preActions = useApplyReducers(
    //     app('cms'),
    //     `itemActions`,
    //     DEFAULT_ACTIONS
    // ) as Action[];

    // const actions = useApplyReducers(
    //     app('cms'),
    //     `item${_.upperFirst(_.camelCase(Model.getSchemaName()))}Actions`,
    //     preActions
    // ) as Action[];

    const {
        isSelected, handleSelectToggle,
    } = useSelection();

    return (
        <MuiTableRow
            {...props}
            sx={{ cursor: !item.deletedAt ? 'pointer' : 'default' }}
            selected={isSelected(item)}
            hover={!item.deletedAt}
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
                    onClick={() => {
                        if (!item.deletedAt) {
                            navigate(`/${_.kebabCase(Model.plural())}/${item.getKey()}`);
                        }
                    }}
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
                    onClick={() => {
                        if (!item.deletedAt) {
                            navigate(`/${_.kebabCase(Model.plural())}/${item.getKey()}`);
                        }
                    }}
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