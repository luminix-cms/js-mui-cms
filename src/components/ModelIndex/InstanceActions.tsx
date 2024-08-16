import React from 'react';


import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { InstanceAction } from '../../types/Table';
import { app, Model } from '@luminix/core';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useNotify from '../../hooks/useNotify';
import useDialog from '../../hooks/useDialog';
import { useTranslation } from 'react-i18next';
import { usePagination } from '@luminix/react';

const InstanceActions = ({ item }: { item: Model }) => {

    const { refresh } = usePagination();
    const { t } = useTranslation();
    const notify = useNotify();
    const dialog = useDialog();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const currentTab = searchParams.get('tab') ?? 'all';

    const actions: InstanceAction[] = React.useMemo(() => {
        return app('cms').getInstanceActions(item.constructor, currentTab);
    }, [item, currentTab]);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);

    const handleOpenFilter = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseFilter = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                aria-describedby="model-item-actions"
                aria-label="filter"
                onClick={handleOpenFilter}
            >
                <MoreVertIcon />
            </IconButton>

            <Menu
                id="model-item-actions"
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseFilter}
                MenuListProps={{
                    'aria-labelledby': 'model-item-action',
                }}
            >
                {actions.map((action) => (
                    <MenuItem
                        key={action.label}
                        onClick={() => action.callback({
                            item,
                            refresh,
                            notify,
                            dialog,
                            navigate,
                            t,
                        })}
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