
import React from 'react';
import ReactDOM from 'react-dom';

import { app } from '@luminix/core';
import { useApplyReducers } from '@luminix/react';
import _ from 'lodash';

import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import MuiFab from '@mui/material/Fab';
import MuiSpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';

import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { styled } from '@mui/material/styles';

import { Action } from '../../types/Table';
import { ActionsProps } from '../../types/PropTypes';
import useCurrentModel from '../../hooks/useCurrentModel';

const Fab = styled(MuiFab)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
}));

const SpeedDial = styled(MuiSpeedDial)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
}));

const Actions: React.FunctionComponent<ActionsProps> = ({ variant = 'default' }) => {

    const Model = useCurrentModel();

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const DEFAULT_ACTIONS = React.useMemo(() => [
        {
            label: `Create ${Model.singular()}`,
            callback: () => {
                console.log('Create');
            },
            icon: <AddIcon />,
        },
    ], [Model]);

    const preActions = useApplyReducers(
        app('cms'),
        `modelActions`,
        DEFAULT_ACTIONS
    ) as Action[];

    const actions = useApplyReducers(
        app('cms'),
        `model${_.upperFirst(_.camelCase(Model.getSchemaName()))}Actions`,
        preActions
    ) as Action[];

    const handleSplitButtonClick = (callback: () => void,) => {
        callback();
    };

    const handleSplitMenuItemClick = (
        _: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleSplitMenuToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleSplitMenuClose = (event: Event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    };

    if (variant === 'fab') {

        if (actions.length === 1) {
            return ReactDOM.createPortal(
                <Fab
                    color="primary"
                    onClick={() => handleSplitButtonClick(actions[0].callback)}
                >
                    {actions[0].icon || actions[0].label.charAt(0).toUpperCase()}
                </Fab>,
                document.body
            );
        }

        return ReactDOM.createPortal(
            <SpeedDial
                ariaLabel={`actions for ${Model.singular()}`}
                icon={<SpeedDialIcon />}
                color="primary"
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.label}
                        icon={action.icon || action.label.charAt(0).toUpperCase()}
                        tooltipTitle={action.label}
                        onClick={() => handleSplitButtonClick(action.callback)}
                    />
                ))}
            </SpeedDial>,
            document.body
        );

    }


    return (
        <>
            <ButtonGroup
                variant="contained"
                ref={anchorRef}
                aria-label={actions[selectedIndex].label}
            >
                <Button onClick={() => handleSplitButtonClick(actions[selectedIndex].callback)}>
                    {actions[selectedIndex].label}
                </Button>
                {actions.length > 1 && (
                    <Button
                        variant="contained"
                        size="small"
                        aria-controls={open ? 'split-button-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-label={`select ${Model.singular()} actions`}
                        aria-haspopup="menu"
                        onClick={handleSplitMenuToggle}
                    >
                        <ArrowDropDownIcon />
                    </Button>
                )}
            </ButtonGroup>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleSplitMenuClose}>
                                <MenuList id="split-button-menu">
                                    {actions.map((action, index) => (
                                        <MenuItem
                                            key={action.label}
                                            selected={index === selectedIndex}
                                            onClick={(event) =>
                                                handleSplitMenuItemClick(event, index)
                                            }
                                        >
                                            {action.label}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
};

export default Actions;
