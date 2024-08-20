import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';

import { LinkTypeMap } from '@mui/material/Link';
import { DefaultComponentProps } from '@mui/material/OverridableComponent';


export type LinkProps = DefaultComponentProps<LinkTypeMap> & RouterLinkProps;

const Link = React.forwardRef(({ to, children, ...props }: LinkProps, ref: React.Ref<HTMLAnchorElement>) => (
    <MuiLink
        component={RouterLink}
        to={to}
        ref={ref}
        sx={{ textDecoration: 'none' }}
        {...props}
    >
        {children}
    </MuiLink>
));

Link.displayName = 'Link';

export default Link;
