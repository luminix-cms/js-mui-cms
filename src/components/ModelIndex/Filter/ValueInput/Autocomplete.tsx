/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';

import { collect, Model } from '@luminix/core';
import { Collection } from '@luminix/core/dist/types/Collection';

import ModelFilterRowContext from '../../../../contexts/ModelFilterRowContext';

import useCurrentModel from '../../../../hooks/useCurrentModel';

import TextField from '@mui/material/TextField';
import MuiAutocomplete from '@mui/material/Autocomplete';

import { loadRelationOptions } from '../../../../support/ModelIndex/Filter/input';

const Autocomplete: React.FunctionComponent = () => {

    const Model = useCurrentModel();

    const { 
        key, 
        value, setValue, 
    } = React.useContext(ModelFilterRowContext);
  
    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');
    const [loadedOptions, setLoadedOptions] = React.useState<Collection<Model>>(collect([]));

    const [inputValue, setInputValue] = React.useState<Model[]>([]);

    /* * */

    React.useEffect(() => {
        if (value.length > 0) {
            setInputValue(
                value.map((_v: any) => ({
                    id: parseInt(_v),
                    getKey() {
                        return parseInt(_v);
                    },
                    getLabel() {
                        return _v.toString();
                    },
                    _is_mocked: true, 
                })
            ));
        }
    }, []);

    React.useEffect(() => {

        let active = true;

        (async () => {
            if (active) {
                const newOptions = await loadRelationOptions(Model, key);
                setLoadedOptions(newOptions);
            }
        })();

        return () => { active = false };
    }, []);

    React.useEffect(() => {
        setValue(inputValue.map((v: any) => v.getKey()));
    }, [inputValue]);
    
    return (
        <MuiAutocomplete
            
            size="small"
            sx={{ width: 247.5 }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            value={value}
            onChange={(_, newValue) => {
                setInputValue(newValue);
            }}
            inputValue={searchValue}
            onInputChange={(_, newInputValue) => {
                setSearchValue(newInputValue);
            }}
            //
            options={loadedOptions.all() || []}
            getOptionLabel={(option) => option.label.toString()}
            isOptionEqualToValue={(option, value) => option.key === value.key}
            //
            renderInput={(params) => <TextField {...params} label="Value" />}
            //
            autoHighlight
        />
    )
}

export default Autocomplete;