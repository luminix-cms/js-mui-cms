import { Avatar, useMediaQuery } from '@mui/material';

import useHasSearch from '../../hooks/useHasSearch';

import logo from '../../assets/luminix-40x40.png';
import whiteLogo from '../../assets/luminix-white-40x40.png';

function AppLogo() {

    const prefersDarkTheme = useMediaQuery('(prefers-color-scheme: dark)');
    const searching = useHasSearch();

    return (
        <Avatar
            src={prefersDarkTheme ? logo : whiteLogo}
            alt="Luminix"
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
