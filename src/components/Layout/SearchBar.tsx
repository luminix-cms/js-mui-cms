import React from 'react';

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';

import SearchIcon from '@mui/icons-material/Search';

import { useSearchParams } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import useIsDesktopMode from '../../hooks/useIsDesktopMode';


const SearchField = styled(TextField)({
    '& .MuiInputBase-root': {
        backgroundColor: 'white',
    },
    // transition: 'width 250ms ease-in-out',
});


const SearchBar: React.FunctionComponent = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [focus, setFocus] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => setSearchParams((params) => {
        const newParams = new URLSearchParams(params);

        if (e.target.value) {
            newParams.set('q', e.target.value);
        } else {
            newParams.delete('q');
        }

        return newParams;
    });

    const isDesktop = useIsDesktopMode();

    const width = isDesktop
        ? 300
        : 'calc(100vw - 58px)';

    return (
        <>
            {!isDesktop && !focus && (
                <IconButton color="inherit" onClick={() => setFocus(true)}>
                    <SearchIcon  />
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
                    value={searchParams.get('q') || ''} 
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
