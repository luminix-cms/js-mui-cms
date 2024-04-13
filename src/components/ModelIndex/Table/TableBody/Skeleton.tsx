import React from 'react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import MuiSkeleton from '@mui/material/Skeleton';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import useTable from '../../../../hooks/useTable';
import { app } from '@luminix/core';
import useIsDesktopMode from '../../../../hooks/useIsDesktopMode';
import { useSearchParams } from 'react-router-dom';

const Skeleton: React.FunctionComponent = () => {

    const {
        massActions, columns,
    } = useTable();

    const isDesktop = useIsDesktopMode();

    const {
        ['ModelIndex.Table.ShrinkedCell']: ShrinkedCell,
    } = app('cms').getComponents();

    const [searchParams] = useSearchParams();

    const listLength = parseInt(searchParams.get('per_page') || '15');

    return (
        <>
            {Array.from({ length: listLength }).map((_, index) => (
                <TableRow key={index}>
                    {massActions.length > 0 && (
                        <ShrinkedCell>
                            <Checkbox />
                        </ShrinkedCell>
                    )}
                    {isDesktop && columns.map((_, index) => (
                        <TableCell key={index}>
                            <MuiSkeleton
                                variant="text"
                                width="100%"
                                height={24}
                            />
                        </TableCell>
                    ))}
                    {!isDesktop && (
                        <TableCell>
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