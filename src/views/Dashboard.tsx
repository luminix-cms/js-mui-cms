import React from "react";
import useSetPageTitle from '../hooks/useSetPageTitle';


const Dashboard: React.FunctionComponent = () => {

    useSetPageTitle('Dashboard');

    return (
        <>
            Dashboard
        </>
    );
};

export default Dashboard;
