import React from 'react';
import { LayoutContext } from '../providers/LayoutProvider';


export default function useSetPageTitle(title: string): void {

    const { setCurrentPage } = React.useContext(LayoutContext);

    React.useEffect(() => {
        setCurrentPage(title);
        return () => {
            setCurrentPage('');
        };
    }, [title, setCurrentPage]);

}

