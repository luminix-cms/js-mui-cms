import React from "react";
import useSetPageTitle from '../hooks/useSetPageTitle';

import { collect } from "@luminix/core";
import useNotifications from "../hooks/useNotifications";

// import { Form } from "@luminix/react";


const Dashboard: React.FunctionComponent = () => {

    useSetPageTitle('Dashboard');

    const { notify } = useNotifications();

    const [count, setCount] = React.useState(0);

    return (
        <>
            Dashboard
            <br/>
            <button
                onClick={() => {
                    notify({
                        message: 'Lorem ipsum ' + count,
                        severity: collect(['error', 'info', 'success', 'warning']).random()!,
                        actions: [
                            {
                                label: 'Action 1',
                                callback: () => {
                                    console.log('Action 1');
                                }
                            },
                            {
                                label: 'Action 2',
                                callback: () => {
                                    console.log('Action 2');
                                }
                            }
                        ]
                    });
                    setCount(count + 1);
                }}
            >
                Criar notificação
            </button>
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
