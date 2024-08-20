import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { app } from '@luminix/core';

import ModelFilterContext from '../../contexts/ModelFilterContext';

import useIsDesktopMode from '../../hooks/useIsDesktopMode';
import useCurrentModel from '../../hooks/useCurrentModel';

import {
    Badge,
    Dialog,
    IconButton,
    Popover,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';

import {
    FilterList as FilterListIcon,
    Close as CloseIcon,
} from '@mui/icons-material';

import Content from './Filter/Content';

import { FilterColumn, FilteredColumn } from '../../types/Filter';

import { searchParamsToObject } from '../../support/searchParams';
import { translateColumnsFromQuery, translateColumnsToQuery } from '../../support/ModelIndex/Filter/searchParams';

const Filter: React.FunctionComponent = () => {

    const { t } = useTranslation();

    const FilterFacade = app('filter');

    const isDesktop = useIsDesktopMode();
    const Model = useCurrentModel();

    const [searchParams, setSearchParams] = useSearchParams();
    const hasFilters = React.useMemo(() => ('where' in searchParamsToObject(searchParams)), [searchParams]);

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement|null>(null);
    const [columnsFilter, setColumnsFilter] = React.useState<FilteredColumn[]>([]);

    const open = Boolean(anchorEl);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const columns: FilterColumn[] = React.useMemo(() => FilterFacade.getFilterableColumns(Model), [Model]);

    const handleOpenFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseFilter = () => {
        setAnchorEl(null);

        setTimeout(() => {
            setColumnsFilter([]);
        }, 300);
    };

    const handleApplyFilters = () => {
        clearSearchParams();

        const searchParams = translateColumnsToQuery(columnsFilter);

        setSearchParams(searchParams, { replace: true });
    };

    const clearSearchParams = () => {
        setSearchParams((prev: URLSearchParams) => {
            const searchParams = new URLSearchParams(prev);

            for (const [key] of prev.entries()) {
                if (key.startsWith('where[')) {
                    searchParams.delete(key);
                }
            }
            return searchParams;
        });
    };

    const clearFilters = () => {
        clearSearchParams();

        setTimeout(() => {
            setColumnsFilter([]);
        }, 300);
    };

    React.useEffect(() => {
        const filteredColumns = translateColumnsFromQuery(columns, searchParams);

        setColumnsFilter(filteredColumns);
    }, [columns, searchParams, anchorEl]);

    return (
        <ModelFilterContext.Provider 
            value={{ 
                Model, 
                anchorEl, setAnchorEl,
                columnsFilter, setColumnsFilter, 
                searchParams, setSearchParams,
                handleApplyFilters, 
                clearSearchParams,
                clearFilters,
            }} 
        >
            <IconButton
                aria-describedby="model-filter-popover-button"
                aria-label="filter"
                onClick={handleOpenFilter}
            >
                <Badge
                    color="secondary"
                    variant="dot"
                    invisible={!hasFilters}
                >
                    <FilterListIcon />
                </Badge>
            </IconButton>

            {isDesktop
                ? (
                    <Popover
                        id="model-filter-popover"
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleCloseFilter}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Content />
                    </Popover>
                )
                : (
                    <Dialog
                        open={open}
                        onClose={handleCloseFilter}
                        fullWidth
                    >
                        <DialogTitle>
                            {t('Filter :model', { model: Model.plural() })}

                            <IconButton
                                onClick={handleCloseFilter}
                                sx={{ position: 'absolute', right: 8, top: 8 }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        
                        <DialogContent dividers >
                            <Content dialog />
                        </DialogContent>

                        <DialogActions>
                            <Button 
                                onClick={clearFilters} 
                                sx={{ mr: 'auto' }} 
                            >
                                {t('Clear')}
                            </Button>

                            <Button
                                variant="contained"
                                onClick={handleApplyFilters}
                                disabled={FilterFacade.checkIfCanApplyFilters(columnsFilter)}
                            >
                                {t('Apply')}
                            </Button>
                        </DialogActions>
                    </Dialog>
                )
            }
        </ModelFilterContext.Provider>
    );
};

export default Filter;