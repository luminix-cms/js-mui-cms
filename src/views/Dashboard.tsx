import { app } from '@luminix/core';

import React from "react";
import useSetPageTitle from '../hooks/useSetPageTitle';


const Dashboard: React.FunctionComponent = () => {

    useSetPageTitle('Dashboard');

    const {
        DesktopPageTitle
    } = app('cms').getComponents();

    return (
        <>
            <DesktopPageTitle />
        </>
    );
};

export default Dashboard;
