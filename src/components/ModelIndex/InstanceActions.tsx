import React from 'react';
import { app, ModelType as Model } from '@luminix/core';
import { useSearchParams } from 'react-router-dom';

import {
    IconButton,
    Menu,
    MenuItem
} from '@mui/material';

import {
    MoreVert as MoreVertIcon
} from '@mui/icons-material';

import { InstanceAction } from '../../types/Table';
import useActionEvent from '../../hooks/useActionEvent';

const InstanceActions = ({ item }: { item: Model }) => {

    const e = useActionEvent();

    const [searchParams] = useSearchParams();

    const currentTab = searchParams.get('tab') ?? 'all';

    const actions: InstanceAction[] = React.useMemo(() => {
        return app('cms').getInstanceActions(app('model').make(item.getType()), currentTab);
    }, [item, currentTab]);

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement|null>(null);

    const open = Boolean(anchorEl);

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    if (actions.length === 0) {
        return null;
    }

    return (
        <>
            <IconButton
                aria-describedby="model-item-actions"
                aria-label="filter"
                onClick={handleOpen}
            >
                <MoreVertIcon />
            </IconButton>

            <Menu
                id="model-item-actions"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'model-item-action',
                }}
            >
                {actions.map((action) => (
                    <MenuItem
                        key={action.label}
                        onClick={() => {
                            action.callback({
                                item,
                                ...e,
                            });
                            handleClose();
                        }}
                        sx={{ px: 1, gap: .75 }}
                    >
                        {action.icon}
                        {action.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default InstanceActions;