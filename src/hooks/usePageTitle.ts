import React from 'react';
import { LayoutContext } from '../providers/LayoutProvider';


export default function usePageTitle(): string {
    const { currentPage } = React.useContext(LayoutContext);
    return currentPage;
}