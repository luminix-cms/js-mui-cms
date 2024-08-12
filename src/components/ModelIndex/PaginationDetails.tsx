
import React from 'react';
import { usePagination } from '@luminix/react';

import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';


const PaginationDetails: React.FunctionComponent = () => {

    const { t } = useTranslation();
    const {
        meta: {
            total = 0,
            from = 0,
            to = 0,
        } = {},
    } = usePagination();

    return (
        <Typography variant="caption" noWrap>
            {/* {from}–{to} {t('of')} {total} */}
            {t(':from–:to of :total', {
                from,
                to,
                total,
            })}
        </Typography>
    );

};



export default PaginationDetails;

