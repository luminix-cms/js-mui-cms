import { Outlet } from 'react-router-dom';

const App: React.FunctionComponent = () => {
    return (
        <div>
            <h1>Layout</h1>
            <main>
                <Outlet />
            </main>
        </div>
    )
};

export default App;

