import React from "react";
import LayoutContext from "../contexts/LayoutContext";

/**
 * 
 * Sets the back button to be visible.
 * 
 */
export default function useBackButton() {

    const { setShowBackButton } = React.useContext(LayoutContext);

    React.useEffect(() => {
        setShowBackButton(true);
        return () => {
            setShowBackButton(false);
        };
    }, [setShowBackButton]);

}


