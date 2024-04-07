import React from 'react';

import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { RecursiveMenuProps } from '../types/PropTypes';

import useLayoutConfig from '../hooks/useLayoutConfig';



const RecursiveMenu: React.FunctionComponent<RecursiveMenuProps> = ({
    collapsed = false, items, onClick,
    ...props
}) => {
    const [childrenOpen, setChildrenOpen] = React.useState<{ [key: string]: Element | null }>({});

    const width = useLayoutConfig('drawer.width', 280) as number;

    return (
        <>
            <Menu {...props}>
                {items
                    .filter(({ hidden = () => false }) => !hidden())
                    .map((item) => {
                        const {
                            text, icon, element = null,
                            key, children, onClick: onClickItem,
                            component: Component, to,
                        } = item;

                        if (element) {
                            return element;
                        }

                        // const { onClick: onClickItem, ...buttonProps } = ListItemButtonProps;

                        return (
                            <MenuItem
                                key={key}
                                onClick={(e) => {
                                    if (onClickItem) {
                                        onClickItem(e);
                                    }
                                    if (children) {
                                        setChildrenOpen({
                                            ...childrenOpen,
                                            [key]: childrenOpen[key] ? null : e.currentTarget,
                                        });
                                        return;
                                    }
                                    if (onClick) {
                                        onClick(e);
                                    }
                                }}
                                {...({
                                    component: Component,
                                    to,
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                } as any)}
                            >
                                {icon && (
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: !collapsed ? 3 : 'auto',
                                            justifyContent: 'center',
                                            color: 'inherit',
                                        }}
                                    >
                                        {icon}
                                    </ListItemIcon>
                                )}
                                <ListItemText sx={{ opacity: !collapsed ? 1 : 0 }}>
                                    {text}
                                </ListItemText>
                                {!collapsed && children && (
                                    <ChevronRightIcon />
                                )}
                            </MenuItem>
                        );
                    })}
            </Menu>
            {items.map((item) => {
                const { key, children } = item;

                if (!children) {
                    return null;
                }

                return (
                    <RecursiveMenu
                        key={key}
                        items={children}
                        onClick={onClick}
                        collapsed={collapsed}
                        sx={{ pl: collapsed ? 0 : 2, pb: 0 }}
                        open={!!childrenOpen[key]}
                        anchorEl={childrenOpen[key]}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        onClose={() => setChildrenOpen({ ...childrenOpen, [key]: null })}
                        slotProps={{ paper: { sx: { minWidth: width } } }}
                    />
                );
            })}
        </>
    );
};

export default RecursiveMenu;