
import React from 'react';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl, { FormControlProps } from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import useSelection from '../../hooks/useSelection';
import useCurrentModel from '../../hooks/useCurrentModel';
import { useSearchParams } from 'react-router-dom';
import useTable from '../../hooks/useTable';

function MassActions(props: FormControlProps): React.ReactNode {

    const [action, setAction] = React.useState('');

    const { selected } = useSelection();
    const Model = useCurrentModel();
    const [searchParams] = useSearchParams();

    const { massActions } = useTable();

    const currentTab = searchParams.get('tab') ?? 'all';

    // const DEFAULT_ACTIONS = React.useMemo(() => {

    // }, [Model]);

    // const preActions = useApplyReducers(
    //     app('cms'),
    //     `modelActions`,
    //     DEFAULT_ACTIONS
    // ) as Action[];

    // const actions = useApplyReducers(
    //     app('cms'),
    //     `model${_.upperFirst(_.camelCase(Model.getSchemaName()))}Actions`,
    //     preActions
    // ) as Action[];

    const handleChange = (event: SelectChangeEvent) => {
      setAction(event.target.value);
    };

    return (
        <FormControl
            sx={{ m: 1, minWidth: 120 }}
            size="small"
            {...props}
        >
            <InputLabel id="mass-actions-select-label">Age</InputLabel>
            <Select
                labelId="mass-actions-select-label"
                id="mass-actions-select"
                value={action}
                label="Age"
                onChange={handleChange}
                disabled={selected.isEmpty()}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {/* <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem> */}
                {massActions.map((action) => (
                    <MenuItem
                        key={action.key}
                        value={action.key}
                    >
                        {action.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}


export default MassActions;
