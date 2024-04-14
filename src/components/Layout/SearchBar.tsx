import React from 'react';

import Badge from '@mui/material/Badge';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';

import SearchIcon from '@mui/icons-material/Search';

import { SetURLSearchParams, useSearchParams } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import useIsDesktopMode from '../../hooks/useIsDesktopMode';
import _ from 'lodash';
import { SearchBarProps } from '../../types/PropTypes';
import useKeyChord from '../../hooks/useKeyChord';


const SearchField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        backgroundColor: theme.palette.background.paper,
    },
    // transition: 'width 250ms ease-in-out',
}));

const throttleSearch = _.throttle((search: string, setSearchParams: SetURLSearchParams) => {
    setSearchParams((params) => {
        const newParams = new URLSearchParams(params);

        if (search) {
            newParams.set('q', search);
        } else {
            newParams.delete('q');
        }

        return newParams;
    });
}, 500);

const SearchBar: React.FunctionComponent<SearchBarProps> = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const currentSearch = searchParams.get('q') || '';
    const [q, setQ] = React.useState(currentSearch);
    const [focus, setFocus] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        setQ((q) => {
            if (q === currentSearch) {
                return q;
            }

            return currentSearch;
        });
    }, [currentSearch]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        setQ(e.target.value);
    };

    React.useEffect(() => {
        throttleSearch(q, setSearchParams);
    }, [q, setSearchParams]);

    const isDesktop = useIsDesktopMode();

    useKeyChord(['Control', '/'], () => {
        inputRef.current!.focus();
    });

    const width = isDesktop
        ? 300
        : 'calc(100vw - 58px)';

    return (
        <>
            {!isDesktop && !focus && (
                <IconButton color="inherit" onClick={() => setFocus(true)}>
                    <Badge
                        variant="dot"
                        color="secondary"
                        invisible={!currentSearch}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left'
                        }}
                    >
                        <SearchIcon />
                    </Badge>
                    
                </IconButton>
            )}
            <Collapse
                orientation="horizontal"
                in={isDesktop || focus}
                addEndListener={() => {
                    if (!isDesktop && focus) {
                        inputRef.current?.focus();
                    }
                }}
                unmountOnExit={false}
            >
                <SearchField
                    placeholder={isDesktop
                        ? '(Ctrl + /) Search...'
                        : 'Search...'}
                    value={q} 
                    InputProps={{
                        endAdornment: <SearchIcon />,
                    }}
                    inputProps={{
                        ref: inputRef,
                    }}
                    onChange={handleChange}
                    onBlur={() => setFocus(false)}
                    sx={{ width }}
                    size="small"
                />
            </Collapse>
        </>
    );

};

export default SearchBar;
