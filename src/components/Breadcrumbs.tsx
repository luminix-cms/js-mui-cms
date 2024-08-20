import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Breadcrumbs as MuiBreadcrumbs, Link, Typography
} from '@mui/material';

import { config } from '@luminix/core';
import { BreadcrumbsProps } from '../types/PropTypes';


export default function Breadcrumbs(props: BreadcrumbsProps): React.ReactNode {

    const { 
        parts, ...rest
    } = props;

    return (
        <MuiBreadcrumbs
            aria-label="breadcrumb"
            {...rest}
        >
            <Link
                underline="hover"
                color="inherit"
                to="/"
                component={RouterLink}
            >
                {config('app.name', 'Laravel') as string}
            </Link>
            {parts?.map(({ name, href }, index) => (
                href
                    ? <Link
                        underline="hover"
                        color="inherit"
                        key={index}
                        to={href}
                        component={RouterLink}
                    >
                        {name}
                    </Link>
                    : <Typography
                        color="text.primary"
                        key={index}
                    >
                        {name}
                    </Typography>
            ))}
        </MuiBreadcrumbs>
    );
}

