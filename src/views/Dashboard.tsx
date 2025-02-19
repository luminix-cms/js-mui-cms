import React from "react";
import useSetPageTitle from '../hooks/useSetPageTitle';
import { useTranslation } from "react-i18next";

import { Box } from '@mui/material';


const Dashboard: React.FunctionComponent = () => {

    const { t } = useTranslation();
    useSetPageTitle(t('Dashboard'));


    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            Dashboard
        </Box>
    );
};

export default Dashboard;
