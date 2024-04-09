import React from 'react';
import { LayoutContext } from '../providers/LayoutProvider';

export default function useSearch() {
    const { setShowSearch } = React.useContext(LayoutContext);

    React.useEffect(() => {
        setShowSearch(true);

        return () => {
            setShowSearch(false);
        };
    }, [setShowSearch]);


}
