import React from 'react';
import { ModelPaginatedLink } from '@luminix/core';
import { usePagination } from '@luminix/react';
import { Form, useSearchParams } from 'react-router-dom';

import {
    Button,
    Stack,
    TextField
} from '@mui/material';

import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    LastPage as LastPageIcon,
    FirstPage as FirstPageIcon,
} from '@mui/icons-material';

import Link from '../Link';
import { PaginationProps } from '../../types/PropTypes';


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



const Pagination: React.FunctionComponent<PaginationProps> = ({ variant = 'default', ...props }) => {
    
    const isDefault = variant === 'default';

    const [searchParams, setSearchParams] = useSearchParams();
    const [pageText, setPageText] = React.useState(searchParams.get('page') || '1');

    const {
        links: compactLinks,
        meta: {
            current_page: currentPage = 1,
            links = [],
            last_page: lastPage = 1,
        } = {},
    } = usePagination();

    const {
        first, prev, next, last
    } = compactLinks || {};

    const handleChangePage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearchParams((params) => {
            params.set('page', pageText || '1');
            return params;
        });
    };

    const compactLinksWithTextField = [
        { url: currentPage > 1 ? first : null, label: '&laquo; First', active: false },
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
                        variant="standard"
                        sx={{
                            width: 56,
                            '& input': {
                                textAlign: 'center',
                                '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                                    WebkitAppearance: 'none',
                                    margin: 0,
                                },
                                
                            }
                        }}
                        value={pageText}
                        error={Number(pageText) > lastPage}
                        helperText={Number(pageText) > lastPage ? `Max ${lastPage}` : undefined}
                        onChange={(e) => {
                            if (!Number.isNaN(Number(e.target.value)) && Number(e.target.value) > 0) {
                                setPageText(e.target.value);
                            }
                            if (e.target.value === '') {
                                setPageText('');
                            }
                        }}
                        onBlur={(e) => {
                            setSearchParams((params) => {
                                params.set('page', e.target.value || '1');
                                return params;
                        
                            }, { replace: true});
                        }}
                        disabled={lastPage === 1}
                        aria-label="Page number"
                    />
                </Form>
            ),
        },
        { url: next, label: 'Next &raquo;', active: false },
        { url: currentPage < lastPage ? last : null, label: 'Last &raquo;', active: false },
    ];

    React.useEffect(() => {
        currentPage && setPageText(String(currentPage));
    }, [currentPage]);

    return (
        <Stack
            spacing={1}
            direction="row"
            justifyContent="center"
            alignItems="center"
            {...props}
        >
            {(isDefault ? links : compactLinksWithTextField).map((link, i) => (link as { element: React.JSX.Element }).element || (
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
                    <Label label={(link as ModelPaginatedLink).label} />   
                </Button>
            ))}
        </Stack>
    );
};


export default Pagination;





