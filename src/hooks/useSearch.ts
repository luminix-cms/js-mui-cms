import React from 'react';
import LayoutContext from '../contexts/LayoutContext';

/**
 * 
 * Sets the search bar to be visible.
 * 
 */
export default function useSearch() {
    const { setShowSearch } = React.useContext(LayoutContext);

    React.useEffect(() => {
        setShowSearch(true);

        return () => {
            setShowSearch(false);
        };
    }, [setShowSearch]);


}
