import Paper from '@mui/material/Paper';

import Typography from '@mui/material/Typography';

import usePageTitle from '../hooks/usePageTitle';
import useLayoutConfig from '../hooks/useLayoutConfig';
import { app } from '@luminix/core';
import useHasBackButton from '../hooks/useHasBackButton';

const DesktopPageTitle: React.FunctionComponent = () => {

    const pageTitle = usePageTitle();

    const breakpoint = useLayoutConfig('breakpoint', 'md') as string;

    const hasBackButton = useHasBackButton();

    const {
        ['Layout.BackButton']: BackButton,
    } = app('cms').getComponents();

    return (
        <Paper 
            sx={{ 
                display: { xs: 'none', [breakpoint]: 'flex' },
                boxShadow: (theme) => theme.shadows[3],
                py: 2,
                px: 3,
                borderRadius: 0,
                alignItems: 'center',

            }}
        >
            {hasBackButton && <BackButton />}
            <Typography variant="h5" noWrap>
                {pageTitle}
            </Typography>
        </Paper>
    );
};

export default DesktopPageTitle;


