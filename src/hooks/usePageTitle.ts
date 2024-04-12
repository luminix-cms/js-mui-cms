import React from 'react';
import LayoutContext from '../contexts/LayoutContext';

/**
 * 
 * Gets the current page title from the LayoutContext.
 * 
 * @returns {string} The current page title.
 */
export default function usePageTitle(): string {
    const { currentPage } = React.useContext(LayoutContext);
    return currentPage;
}