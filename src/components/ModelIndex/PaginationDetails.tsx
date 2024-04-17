
import React from 'react';
import { useCurrentQuery } from '@luminix/react';

import Typography from '@mui/material/Typography';


const PaginationDetails: React.FunctionComponent = () => {

    const {
        meta: {
            total = 0,
            from = 0,
            to = 0,
        } = {},
    } = useCurrentQuery();

    return (
        <Typography variant="caption">
            {from}–{to} of {total}
        </Typography>
    );

};



export default PaginationDetails;

