import React from 'react';

import MuiTableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';

import MoreVertIcon from '@mui/icons-material/MoreVert';

import useTable from '../../../hooks/useTable';

const TableBody: React.FunctionComponent = () => {

    const { Model, items } = useTable();

    return (
        <MuiTableBody>
            {items.map(item => (
                <TableRow key={item.id}>
                    <TableCell
                        padding="checkbox"
                        sx={{ width: '1px' }}
                    >
                        <Checkbox />
                    </TableCell>
                    <TableCell>
                        {item[Model.getSchema().labeledBy]}
                    </TableCell>
                    <TableCell sx={{ width: '1px' }}>
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
            ))}
        </MuiTableBody>
    );

};


export default TableBody;