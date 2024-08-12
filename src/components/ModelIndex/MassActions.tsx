
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePagination } from '@luminix/react';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack, { StackProps } from '@mui/material/Stack';

import useSelection from '../../hooks/useSelection';
import useTable from '../../hooks/useTable';
import useNotify from '../../hooks/useNotify';
import useDialog from '../../hooks/useDialog';
import { useTranslation } from 'react-i18next';


function MassActions(props: StackProps): React.ReactNode {
    const [action, setAction] = React.useState('');

    const { selected } = useSelection();
    const { refresh } = usePagination();
    const { t } = useTranslation();
    const notify = useNotify();
    const dialog = useDialog();
    const navigate = useNavigate();

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
                            notify,
                            refresh,
                            navigate,
                            dialog,
                            t,
                        });
                }}
            >
                {t('Apply')}
            </Button>
        </Stack>
    );
}


export default MassActions;
