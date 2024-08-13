import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { app } from '@luminix/core';

import ModelFilterContext from '../../contexts/ModelFilterContext';

import useIsDesktopMode from '../../hooks/useIsDesktopMode';
import useCurrentModel from '../../hooks/useCurrentModel';

import Badge from '@mui/material/Badge';
import Dialog from '@mui/material/Dialog';
import FilterListIcon from '@mui/icons-material/FilterList';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';

import Content from './Filter/Content';

import { FilterColumn, FilteredColumn } from '../../types/Filter';

import { searchParamsToObject } from '../../support/searchParams';
import { translateColumnsFromQuery } from '../../support/ModelIndex/Filter/searchParams';

const Filter: React.FunctionComponent = () => {

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
                clearSearchParams,
                clearFilters,
            }} 
        >
            <IconButton
                aria-describedby="model-filter-popover"
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
                        <Content />
                    </Dialog>
                )
            }
        </ModelFilterContext.Provider>
    );
};

export default Filter;