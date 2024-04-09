
import React from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import Link from '../Link';

import { PaginationProps } from '../../types/PropTypes';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';

import useIsDesktopMode from '../../hooks/useIsDesktopMode';
import { Form, useSearchParams } from 'react-router-dom';


const Label: React.FunctionComponent<{ label: string }> = ({ label }) => {

    if (isNaN(label as unknown as number) || isNaN(parseFloat(label))) {
        
        const labelMap: Record<string, React.ReactNode> = {
            ['&laquo; Previous']: <ChevronLeftIcon />,
            ['Next &raquo;']: <ChevronRightIcon />,
            ['Last &raquo;']: <LastPageIcon />,
            ['&laquo; First']: <FirstPageIcon />,
        };

        return (
            <>
                {labelMap[label] || label}
            </>
        );
    }

    return (
        <>
            {label}
        </>
    );

};



const Pagination: React.FunctionComponent<PaginationProps> = ({ links, compactLinks, ...props }) => {
    
    const isDesktop = useIsDesktopMode();


    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = React.useState(parseInt(searchParams.get('page') || '1'));

    const {
        first, prev, next, last
    } = compactLinks;

    const handleChangePage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearchParams((params) => {
            params.set('page', page.toString());
            return params;
        });
    };

    const mobileLinks = [
        { url: first, label: '&laquo; First', active: false },
        { url: prev, label: '&laquo; Previous', active: false },
        {
            element: (
                <Form
                    key="page"
                    onSubmit={handleChangePage}
                    preventScrollReset
                >
                    <TextField
                        size="small"
                        type="number"
                        variant="outlined"
                        sx={{
                            width: 48,
                            '& input': {
                                textAlign: 'center',
                                '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                                    WebkitAppearance: 'none',
                                    margin: 0,
                                },
                                
                            }
                        }}
                        value={page}
                        onChange={(e) => setPage(e.target.value as unknown as number)}
                        onBlur={(e) => {
                            setSearchParams((params) => {
                                params.set('page', e.target.value);
                                return params;
                        
                            }, { replace: true});
                        }}
                    />
                </Form>
            ),
        },
        { url: next, label: 'Next &raquo;', active: false },
        { url: last, label: 'Last &raquo;', active: false },
    ];

    return (
        <Stack
            spacing={1}
            direction="row"
            justifyContent="center"
            alignItems="center"
            {...props}
        >
            {(isDesktop ? links : mobileLinks).map((link, i) => link.element || (
                <Button
                    key={i}
                    variant={link.active ? 'contained' : 'text'}
                    color="primary"
                    size="small"
                    sx={{
                        minWidth: 'unset',
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                    }}
                    disabled={!link.url}
                    {...({
                        component: Link,
                        to: link.url,
                    })}
                >
                    <Label label={link.label} />   
                </Button>
            ))}
        </Stack>
    );
};


export default Pagination;





