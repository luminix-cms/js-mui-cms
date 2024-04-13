import React from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { ModelPaginatedLink } from '@luminix/core/dist/types/Model';
import { Form, useSearchParams } from 'react-router-dom';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';

import Link from '../Link';
import useCurrentQuery from '../../hooks/useCurrentQuery';
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
    
    const isDefault = variant === 'default';//useIsDesktopMode();

    const [searchParams, setSearchParams] = useSearchParams();
    const [pageText, setPageText] = React.useState(parseInt(searchParams.get('page') || '1'));

    const {
        links: compactLinks,
        meta: {
            current_page: currentPage,
            links = []
        } = {},
    } = useCurrentQuery();

    const {
        first, prev, next, last
    } = compactLinks || {};

    const handleChangePage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearchParams((params) => {
            params.set('page', pageText.toString());
            return params;
        });
    };

    const compactLinksWithTextField = [
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
                        onChange={(e) => setPageText(e.target.value as unknown as number)}
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

    React.useEffect(() => {
        currentPage && setPageText(currentPage);
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





