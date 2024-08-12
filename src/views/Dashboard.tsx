import React from "react";
import useSetPageTitle from '../hooks/useSetPageTitle';
import { useTranslation } from "react-i18next";


const Dashboard: React.FunctionComponent = () => {

    const { t } = useTranslation();
    useSetPageTitle(t('Dashboard'));


    return (
        <>
            Dashboard
            {/* <Form
                initialValues={{
                    email: '',
                    password: '',
                    remember: false,
                }}
                onSuccess={(response) => {
                    console.log(response);
                }}
                method="post"
                action="/login"
                preventDefault={false}
            >
                <Form.Input 
                    type="email"
                    name="email"
                    label="Email"
                />
                <Form.Input
                    type="password"
                    name="password"
                    label="Password"
                />
                <Form.Input
                    type="checkbox"
                    name="remember"
                    label="Remember me"
                />
                <button type="submit">
                    Enviar
                </button>

            </Form> */}
        </>
    );
};

export default Dashboard;
