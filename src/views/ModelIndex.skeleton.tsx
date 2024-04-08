
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Unstable_Grid2';

const ModelIndexSkeleton = () => {

    return (
        <Grid container spacing={2}>
            <Grid xs={12}>
                <Skeleton variant="text" width="100%" height={40} />
            </Grid>
            <Grid xs={12}>
                <Skeleton variant="rectangular" width="100%" height={400} />
            </Grid>
        </Grid>
    );
};

export default ModelIndexSkeleton;


