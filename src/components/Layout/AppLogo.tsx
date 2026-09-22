import { Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { config } from '@luminix/core';

import useHasSearch from '../../hooks/useHasSearch';

import logo from '../../assets/luminix-40x40.png';
import whiteLogo from '../../assets/luminix-white-40x40.png';

function AppLogo() {

    // palette.mode is resolved from <LuminixCms colorScheme /> in LuminixCms.tsx
    const darkTheme = useTheme().palette.mode === 'dark';
    const searching = useHasSearch();

    const name = config('luminix.admin.brand.name', 'Luminix') as string;
    const brandLogo = config('luminix.admin.brand.logo', null) as string | null;
    const brandLogoDark = config('luminix.admin.brand.logo_dark', null) as string | null;

    const brandSrc = darkTheme
        ? brandLogoDark ?? brandLogo
        : brandLogo;

    return (
        <Avatar
            src={brandSrc ?? (darkTheme ? logo : whiteLogo)}
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
