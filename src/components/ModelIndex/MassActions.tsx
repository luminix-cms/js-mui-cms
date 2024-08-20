
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
 } from '@mui/material';

import { SelectChangeEvent } from '@mui/material/Select';
import { StackProps } from '@mui/material/Stack';

import useSelection from '../../hooks/useSelection';
import useTable from '../../hooks/useTable';
import useActionEvent from '../../hooks/useActionEvent';

function MassActions(props: StackProps): React.ReactNode {
    const [action, setAction] = React.useState('');

    const { selected } = useSelection();
    const { t } = useTranslation();
    const e = useActionEvent();

    const { massActions } = useTable();

    const handleChange = (event: SelectChangeEvent) => {
      setAction(event.target.value);
    };

    React.useEffect(() => {
        if (selected.isEmpty()) {
            setAction('');
        }
    }, [selected]);

    if (massActions.length === 0) {
        return null;
    }

    const label = selected.isEmpty()
        ? t('Select items to apply')
        : t('Select action');

    return (
        <Stack
            direction="row"
            alignItems="center"
            {...props}
        >
            <FormControl
                sx={{ m: 1, minWidth: 200 }}
                size="small"
            >
                <InputLabel id="mass-actions-select-label">
                    {label}
                </InputLabel>
                <Select
                    labelId="mass-actions-select-label"
                    id="mass-actions-select"
                    value={action}
                    label={label}
                    onChange={handleChange}
                    disabled={selected.isEmpty()}
                >
                    <MenuItem value="">
                        <em>{t('None')}</em>
                    </MenuItem>
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
            <Button
                size="small"
                disabled={selected.isEmpty() || !action}
                onClick={() => {
                    massActions
                        .find((a) => a.key === action)
                        ?.callback({
                            selected,
                            ...e,
                        });
                }}
            >
                {t('Apply')}
            </Button>
        </Stack>
    );
}


export default MassActions;
