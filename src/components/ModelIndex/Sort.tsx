import React from 'react';
import { useSearchParams } from 'react-router-dom';

import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseIcon from '@mui/icons-material/Close';
import SwapVertIcon from '@mui/icons-material/SwapVert';

import useTable from '../../hooks/useTable';
import { collect } from '@luminix/core';

const Sort: React.FunctionComponent = () => {

    const [searchParams, setSearchParms] = useSearchParams();

    const {
        columns, Model
    } = useTable();

    const currentSort = searchParams.get('order_by') || '';
    const [currentSortColumn = '', currentSortDirection = ''] = currentSort.split(':');

    const [column, setColumn] = React.useState(currentSortColumn);
    const [direction, setDirection] = React.useState(currentSortDirection);


    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {

        setOpen(false);
        setColumn(currentSortColumn);
        setDirection(currentSortDirection);
    };

    // const handleSort = (key: string) => () => {
    //     if (currentSortColumn === key) {
    //         setSearchParms((params) => {
    //             const newSearch = new URLSearchParams(params);
    //             if (!currentSortDirection) {
    //                 newSearch.set('order_by', `${key}:asc`);
    //                 return newSearch;
    //             }
    //             if (currentSortDirection === 'desc') {
    //                 newSearch.delete('order_by');
    //                 return newSearch;
    //             }
    //             newSearch.set('order_by', `${key}:desc`);
    //             return newSearch;
    //         });
    //     } else {
    //         setSearchParms((params) => {
    //             const newSearch = new URLSearchParams(params);
    //             newSearch.set('order_by', `${key}:asc`);
    //             return newSearch;
    //         });
    //     }
    // };

    const handleApply = () => {
        setSearchParms((params) => {
            const newSearch = new URLSearchParams(params);
            newSearch.set('order_by', `${column}:${direction}`);
            return newSearch;
        });
        setOpen(false);
    };

    const handleClear = () => {
        setSearchParms((params) => {
            const newSearch = new URLSearchParams(params);
            newSearch.delete('order_by');
            return newSearch;
        });
        handleClose();
    };

    return (
        <>
            <IconButton onClick={handleOpen}>
                <Badge
                    color="secondary"
                    variant="dot"
                    invisible={!currentSortColumn}
                >
                    <SwapVertIcon />
                </Badge>
            </IconButton>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>
                    Sort {Model.plural()}
                    <IconButton
                        onClick={handleClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <RadioGroup
                        value={column}
                        onChange={(e) => setColumn(e.target.value)}
                    >
                        <Typography variant="caption">Column</Typography>
                        <Divider />
                        {collect(columns).whereStrict('sortable', '!=', false).map(({ key, label }) => (
                            <FormControlLabel
                                key={key}
                                value={key}
                                control={<Radio />}
                                label={label}
                            />
                        ))}
                    </RadioGroup>

                    <Typography variant="caption">Direction</Typography>
                    <Divider />
                    <RadioGroup
                        value={direction}
                        onChange={(e) => setDirection(e.target.value)}
                    >
                        <FormControlLabel
                            value="asc"
                            control={<Radio />}
                            label={
                                <>
                                    Ascending
                                    <ArrowUpwardIcon />
                                </>
                            }
                            
                        />
                        <FormControlLabel
                            value="desc"
                            control={<Radio />}
                            label={
                                <>
                                    Descending
                                    <ArrowDownwardIcon />
                                </>
                            }
                        />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClear} sx={{ mr: 'auto' }}>Clear</Button>
                    <Button onClick={handleApply}>Apply</Button>
                </DialogActions>
            </Dialog>
        </>
    );


};

export default Sort;
