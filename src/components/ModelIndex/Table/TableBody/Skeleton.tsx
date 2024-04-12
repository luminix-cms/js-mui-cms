import React from 'react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import MuiSkeleton from '@mui/material/Skeleton';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import useTable from '../../../../hooks/useTable';
import { app } from '@luminix/core';

const LIST_LENGTH = 15;


const Skeleton: React.FunctionComponent = () => {

    const {
        massActions,
    } = useTable();

    const {
        ['ModelIndex.Table.ShrinkedCell']: ShrinkedCell,
    } = app('cms').getComponents();

    return (
        <>
            {Array.from({ length: LIST_LENGTH }).map((_, index) => (
                <TableRow key={index}>
                    {massActions.length > 0 && (
                        <ShrinkedCell>
                            <Checkbox />
                        </ShrinkedCell>
                    )}
                    <TableCell>
                        <MuiSkeleton
                            variant="text"
                            width="100%"
                            // height={32}
                        />
                    </TableCell>
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