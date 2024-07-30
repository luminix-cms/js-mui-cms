/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from 'lodash';

import React from 'react';

import { collect, Model } from '@luminix/core';
import { Collection } from '@luminix/core/dist/types/Collection';

import ModelFilterRowContext from '../../../../contexts/ModelFilterRowContext';

import useCurrentModel from '../../../../hooks/useCurrentModel';

import TextField from '@mui/material/TextField';
import MuiAutocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { loadRelationOptions, aggregateRelationOptions } from '../../../../support/ModelIndex/relation';

const AsyncAutocomplete: React.FunctionComponent = () => {

    const Model = useCurrentModel();

    const { 
        key, 
        value, setValue, 
    } = React.useContext(ModelFilterRowContext);

    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');
    const [loadedOptions, setLoadedOptions] = React.useState<Collection<Model>>(collect([]));

    const [inputValue, setInputValue] = React.useState<Model[]>([]);

    const loading = React.useMemo(
        () => open && loadedOptions.count() === 0, 
        [open, loadedOptions]
    );
    
    const handleInputChange = async (_event: any, newInputValue: string) => {
        setSearchValue(newInputValue);

        let newOptions = collect<Model>([]);

        if (!_.isEmpty(newInputValue)) {
            newOptions = await aggregateRelationOptions(Model, key, newInputValue, loadedOptions);
        } else {
            newOptions = await loadRelationOptions(Model, key);
        }

        setLoadedOptions(newOptions);
    }

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
                })
            ));
        }
    }, []);

    React.useEffect(() => {

        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            if (active) {
                const newOptions = await loadRelationOptions(Model, key);
                setLoadedOptions(newOptions);
            }
        })();

        return () => { active = false };
    }, [loading]);

    React.useEffect(() => {
        setValue(inputValue.map((v: any) => v.getKey()));
    }, [inputValue]);
    
    return (
        <MuiAutocomplete
            sx={{ width: 462 }}
            //
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            //
            value={inputValue}
            onChange={(_, newValue) => {
                setInputValue(newValue);
            }}
            inputValue={searchValue}
            onInputChange={handleInputChange}
            //
            options={loadedOptions.all() || []}
            getOptionLabel={(option) => option.getLabel()}
            isOptionEqualToValue={(option, value) => option.getKey() === value.getKey()}
            //
            renderInput={(params) => (
                <RenderInput 
                    params={params} 
                    loading={loading} 
                />
            )}
            //
            size="small"
            loading={loading}
            autoHighlight
            multiple
        />
    )
}

export default AsyncAutocomplete;

const RenderInput: React.FunctionComponent<any> = ({ params, loading}) => (
    <TextField
        {...params}
        label="Value"
        InputProps={{
            ...params.InputProps,
            endAdornment: (
                <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                </React.Fragment>
            ),
        }}
    />
);