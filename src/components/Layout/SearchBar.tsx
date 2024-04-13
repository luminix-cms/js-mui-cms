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


const SearchField = styled(TextField)({
    '& .MuiInputBase-root': {
        backgroundColor: 'white',
    },
    // transition: 'width 250ms ease-in-out',
});

const reflectToActualSearch = (search: string, setSearchParams: SetURLSearchParams) => {
    setSearchParams((params) => {
        const newParams = new URLSearchParams(params);

        if (search) {
            newParams.set('q', search);
        } else {
            newParams.delete('q');
        }

        return newParams;
    });
};

const SearchBar: React.FunctionComponent<SearchBarProps> = ({ throttle = 500 }) => {

    const [searchParams, setSearchParams] = useSearchParams();

    const currentSearch = searchParams.get('q') || '';
    const [q, setQ] = React.useState(currentSearch);
    const [focus, setFocus] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const reflectRef = React.useRef(_.throttle(reflectToActualSearch, throttle));

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
        reflectRef.current(q, setSearchParams);
    }, [q, setSearchParams]);

    const isDesktop = useIsDesktopMode();

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
                    placeholder="Type to search..."
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
