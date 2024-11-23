/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */


import React from 'react';
import { Collection, Obj } from '@luminix/support';
import { collect, ModelType as Model } from '@luminix/core';

import { useTranslation } from 'react-i18next';

import {
    TextField,
    Autocomplete as MuiAutocomplete,
    CircularProgress,
} from '@mui/material';

import useIsDesktopMode from '../../../../hooks/useIsDesktopMode';
import useCurrentModel from '../../../../hooks/useCurrentModel';
import ModelFilterRowContext from '../../../../contexts/ModelFilterRowContext';

import { loadRelationOptions, aggregateRelationOptions } from '../../../../support/ModelIndex/relation';
import { mountRelationModelOption } from '../../../../support/ModelIndex/Filter/inputs';

const AsyncAutocomplete: React.FunctionComponent = () => {

    const isDesktop = useIsDesktopMode();

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
    
    const handleSearch = async (_event: any, newInputValue: string) => {
        setSearchValue(newInputValue);

        if (!Obj.isEmpty(newInputValue)) {
            setLoadedOptions(await aggregateRelationOptions(Model, key, newInputValue, collect(inputValue)));
        }
    }

    React.useEffect(() => {        
        if (value.length > 0) {
            (async () => {
                setInputValue(await mountRelationModelOption(Model, key, value));
            })();
        }
    }, []);

    React.useEffect(() => {

        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            if (active) {
                setLoadedOptions(await loadRelationOptions(Model, key, inputValue));
            }
        })();

        return () => { active = false };
    }, [loading]);

    React.useEffect(() => {
        setValue(inputValue.map((v) => v.getKey()));

        if (!Obj.isEmpty(searchValue)) {
            setLoadedOptions(collect([]));
        } else {
            (async () => {
                setLoadedOptions(await loadRelationOptions(Model, key, inputValue));
            })();
        }
    }, [inputValue]);
    
    return (
        <MuiAutocomplete
            sx={{ width: isDesktop ? 377 : '100%' }}
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
            onInputChange={handleSearch}
            //
            options={loadedOptions.all() || []}
            getOptionLabel={(option) => option.getLabel()}
            isOptionEqualToValue={(option, value) => option.getKey() === value.getKey()}
            filterOptions={(x) => x}
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
            disableCloseOnSelect
            autoHighlight
            multiple
        />
    )
}

export default AsyncAutocomplete;

const RenderInput: React.FunctionComponent<any> = ({ params, loading}) => {

    const { t } = useTranslation();

    return (
        <TextField
            {...params}
            label={t('Value')}
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
};