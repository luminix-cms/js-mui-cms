
import React from 'react';
import { usePagination } from '@luminix/react';

import Typography from '@mui/material/Typography';


const PaginationDetails: React.FunctionComponent = () => {

    const {
        meta: {
            total = 0,
            from = 0,
            to = 0,
        } = {},
    } = usePagination();

    return (
        <Typography variant="caption" noWrap>
            {from}–{to} of {total}
        </Typography>
    );

};



export default PaginationDetails;

