import React from 'react';
import { app } from '@luminix/core';

import {
    Collapse,
    ListItem,
    ListItemButton,
    List,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';

import {
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

import { MenuItem } from '../types/Menu';
import { RecursiveListProps } from '../types/PropTypes';
import useLayoutConfig from '../hooks/useLayoutConfig';
import Link from './Link';

const RecursiveList: React.FunctionComponent<RecursiveListProps> = ({
    collapsed = false, items, onClick,
    ...props
}) => {
    const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
    const [dropItems, setDropItems] = React.useState<MenuItem[] | null>(null);
    const [childrenOpen, setChildrenOpen] = React.useState<{ [key: string]: boolean }>({});

    const width = useLayoutConfig('drawer.width', 280) as number;

    const RecursiveMenu = app('cms').getComponent('RecursiveMenu');

    return (
        <List {...props}>
            {items.map((item) => {
                const {
                    text, icon, element = null, key,
                    children, to, onClick: onClickItem
                } = item;

                if (element) {
                    return element;
                }

                return (
                    <ListItem
                        key={key}
                        disablePadding
                        sx={{ display: 'block' }}
                    >
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: !collapsed ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            onClick={(e) => {
                                if (onClickItem) {
                                    onClickItem(e);
                                }
                                if (children) {
                                    if (collapsed) {
                                        setDropItems(() => {
                                            setAnchorEl(e.currentTarget);
                                            return children;
                                        });
                                        return;
                                    }
                                    setChildrenOpen({
                                        ...childrenOpen,
                                        [key]: !childrenOpen[key],
                                    });
                                    return;
                                }
                                if (onClick) {
                                    onClick(e);
                                }
                            }}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            {...(to ? { to, component: Link } as any : {})}
                        >
                            
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: !collapsed ? 3 : 'unset',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    color: 'inherit',
                                }}
                            >
                                {icon}
                                {collapsed && (
                                    <Typography
                                        fontSize={10}
                                        sx={{ mt: 0.5 }}
                                    >
                                        {text}
                                    </Typography>
                                )}
                            </ListItemIcon>
                        
                            {!collapsed
                                && <ListItemText primary={text} />
                            }
                            {!collapsed && children && (childrenOpen[key]
                                ? <ExpandLessIcon />
                                : <ExpandMoreIcon />)}
                        </ListItemButton>
                        {children && !collapsed && (
                            <Collapse
                                in={childrenOpen[key]}
                                timeout="auto"
                                unmountOnExit
                            >
                                <RecursiveList
                                    items={children}
                                    onClick={onClick}
                                    collapsed={collapsed}
                                    sx={{ pl: collapsed ? 0 : 2, pb: 0 }}
                                />
                            </Collapse>
                        )}

                    </ListItem>
                );
            })}
            {collapsed && (
                <RecursiveMenu
                    items={dropItems || []}
                    onClick={onClick}
                    collapsed={false}
                    sx={{ pl: collapsed ? 0 : 2, pb: 0 }}
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    onClose={() => {
                        setAnchorEl(null);
                        setDropItems(null);
                    }}
                    open={Boolean(anchorEl)}
                    slotProps={{ paper: { sx: { minWidth: width } } }}
                />
            )}
        </List>
    );
};

export default RecursiveList;