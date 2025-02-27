import React from 'react';
import { app } from '@luminix/core';

import {
    TableRow,
    TableCell,
    Checkbox,
    IconButton,
    Skeleton as MuiSkeleton,
} from '@mui/material';

import {
    MoreVert as MoreVertIcon
} from '@mui/icons-material';

import useTable from '../../../../hooks/useTable';
import useIsDesktopMode from '../../../../hooks/useIsDesktopMode';

const Skeleton: React.FunctionComponent = () => {

    const {
        massActions, columns, items,
    } = useTable();

    const isDesktop = useIsDesktopMode();

    const {
        ['ModelIndex.Table.ShrinkedCell']: ShrinkedCell,
    } = app('cms').getComponents();

    const listLength = items?.count() || 15;
    
    return (
        <>
            {Array.from({ length: listLength }).map((_, index) => (
                <TableRow key={index}>
                    {massActions.length > 0 && (
                        <ShrinkedCell>
                            <Checkbox />
                        </ShrinkedCell>
                    )}
                    {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                    {isDesktop && columns.map(({ key, label, sortable, ...props }, index) => (
                        <TableCell key={index} {...props}>
                            <MuiSkeleton
                                variant="text"
                                // width="100%"
                                height={24}
                            />
                        </TableCell>
                    ))}
                    {!isDesktop && (
                        <TableCell sx={{ px: 0 }}>
                            {Array.from({ length: columns.length }).map((_, index) => (
                                <MuiSkeleton
                                    key={index}
                                    variant="text"
                                    width="100%"
                                    height={24}
                                />
                            ))}
                        </TableCell>
                    )}
                    <ShrinkedCell>
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
                    </ShrinkedCell>
                </TableRow>
            ))}
        </>
    )
};


export default Skeleton;