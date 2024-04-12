import React from 'react';
import LayoutContext from '../contexts/LayoutContext';

/**
 * 
 * Sets a title for the current page.
 * 
 * @param title 
 * 
 */
export default function useSetPageTitle(title: string): void {

    const { setCurrentPage } = React.useContext(LayoutContext);

    React.useEffect(() => {
        setCurrentPage(title);
        return () => {
            setCurrentPage('');
        };
    }, [title, setCurrentPage]);

}

