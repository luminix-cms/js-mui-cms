import React from "react";
import LayoutContext from "../contexts/LayoutContext";

/**
 * 
 * Returns true if the back button should be visible.
 * 
 */
export default function useHasBackButton() {

    const { showBackButton } = React.useContext(LayoutContext);

    return showBackButton;

}


