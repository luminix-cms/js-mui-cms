import Paper from '@mui/material/Paper';

import Typography from '@mui/material/Typography';

import usePageTitle from '../hooks/usePageTitle';
import useLayoutConfig from '../hooks/useLayoutConfig';

const DesktopPageTitle: React.FunctionComponent = () => {

    const pageTitle = usePageTitle();

    const breakpoint = useLayoutConfig('breakpoint', 'md') as string;

    return (
        <Paper 
            sx={{ 
                display: { xs: 'none', [breakpoint]: 'block' },
                boxShadow: (theme) => theme.shadows[3],
                py: 4,
                px: 3,
                borderRadius: 0,

            }}
        >
            <Typography variant="h4" noWrap>
                {pageTitle}
            </Typography>
        </Paper>
    );
};

export default DesktopPageTitle;


