import { Avatar, useMediaQuery } from '@mui/material';
import { config } from '@luminix/core';

import useHasSearch from '../../hooks/useHasSearch';

import logo from '../../assets/luminix-40x40.png';
import whiteLogo from '../../assets/luminix-white-40x40.png';

/**
 * The mark shown in the panel's app bar.
 *
 * It reads the identity the host application publishes under
 * `luminix.admin.brand`, and only falls back to the Luminix mark when nothing
 * is configured. Before that, every product built on this package showed our
 * logo to its own end users, and the only way out was replacing this component
 * through `componentMap` — code written for the sole purpose of not shipping
 * someone else's brand.
 */
function AppLogo() {

    const prefersDarkTheme = useMediaQuery('(prefers-color-scheme: dark)');
    const searching = useHasSearch();

    const name = config('luminix.admin.brand.name', 'Luminix') as string;
    const configured = config(
        prefersDarkTheme ? 'luminix.admin.brand.logo_dark' : 'luminix.admin.brand.logo',
        null,
    ) as string | null;

    /*
     * The dark variation is optional: an application that sends a single logo
     * gets it in both schemes, which is better than falling back to ours for
     * half the users.
     */
    const fallbackBrand = config('luminix.admin.brand.logo', null) as string | null;

    return (
        <Avatar
            src={configured ?? fallbackBrand ?? (prefersDarkTheme ? logo : whiteLogo)}
            alt={name}
            variant="square"
            sx={{
                width: 40,
                height: 40,
                marginLeft: searching 
                    ? 2
                    : 0,
            }}
        />
    );
}

export default AppLogo;
