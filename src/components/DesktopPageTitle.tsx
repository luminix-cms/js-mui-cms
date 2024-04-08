import Paper from '@mui/material/Paper';

import Typography from '@mui/material/Typography';


import usePageTitle from "../hooks/usePageTitle";
import useLayoutConfig from '../hooks/useLayoutConfig';

const DesktopPageTitle: React.FunctionComponent = () => {

    const pageTitle = usePageTitle();

    const breakpoint = useLayoutConfig('layout.breakpoint', 'md') as string;

    return (
        <Paper 
            sx={{ 
                display: { xs: 'none', [breakpoint]: 'block' },
                boxShadow: (theme) => theme.shadows[1],
                py: 4,
                px: 3,
                borderRadius: '0 0 15px 0',
                
            }}
        >
            <Typography variant="h4" noWrap>
                {pageTitle}
            </Typography>
        </Paper>
    );
};

export default DesktopPageTitle;


