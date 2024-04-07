import { Breakpoint } from '@mui/material/styles';


export type CmsConfig = {
    layout?: {
        breakpoint?: Breakpoint,
        // drawerWidth?: number,

        drawer?: {
            width?: number,
        },
        
        appBar?: {
            height?: number,
            color?: string,
        },

    }
};



