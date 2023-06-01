import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import {
    Button,
    debounce,
    Dialog,
    Divider,
    Grid,
    IconButton,
    ListSubheader,
    Stack,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { QuickFill } from './QuickFill';
import { FilteredSearch } from './FilteredSearch';
import { SearchInput } from './SearchInput';
import { SearchButton } from './SearchButton';

import { PaddedIcon } from './PaddedIcon';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { RecentSearches } from './RecentSearches';
import { addAllezRecent, clearAllezRecents, getAllezRecents } from './helpers';

const ALLEZ_SEARCH_INPUT_ID = 'allez-search-input';
const ALLEZ_POPOVER_ID = 'allez-popover';

// TODO: implement variable row heights using this enum to support react-window's itemSize() function
export enum SearchResultHeightSize {
    SMALL = 24,
    MEDIUM = 32,
    LARGE = 40,
    XLARGE = 48,
}

export type SearchResultHeight = SearchResultHeightSize | number;

export type AllezSearchItemRequirements = { label: string } | string;

export type AllezSearchProps<T> = {
    placeholder?: string;
    items: T[];
    quickFillItems?: T[];
    maxHeight?: React.CSSProperties['maxHeight'];
    maxWidth?: React.CSSProperties['maxWidth'];
    showRecents?: boolean;
    onItemSelect: (item: T) => void;
    renderResult?: (result: T, onItemSelectCallback: () => void) => JSX.Element;
    renderRecent?: (recent: T, onItemSelectCallback: () => void) => JSX.Element;
};

export const AllezSearch = <T extends AllezSearchItemRequirements>({
    placeholder,
    items,
    quickFillItems,
    maxHeight,
    maxWidth,
    showRecents = true,
    onItemSelect,
    renderResult,
    renderRecent,
}: AllezSearchProps<T>) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [recentSearches, setRecentSearches] = useState<T[]>([]);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState<T[]>([]);
    const [searchEngine, setSearchEngine] = useState<Fuse<T>>();

    const allezInputRef = useRef<HTMLInputElement | null>(null);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    /**
     * Clears the search text when the search is closed
     */
    useEffect(() => {
        setSearchText('');
        setRecentSearches(getAllezRecents<T>());
        return () => {
            setSearchText('');
        };
    }, []);

    /**
     * Instantiates the search engine and keeps the collections of items to search through up to date
     */
    useEffect(() => {
        if (!searchEngine) {
            setSearchEngine(
                new Fuse(items, typeof items?.at(0) !== 'string' ? { keys: ['label'] } : undefined)
            );
        }
        searchEngine?.setCollection(items);
    }, [items]);

    useEffect(() => {
        if (searchText === '') {
            setSearchResults(items);
        } else {
            setSearchResults(searchEngine?.search(searchText).map((res) => res.item) ?? items);
        }
    }, [searchText, items]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    setOpen(false);
                    break;
                case 'ArrowDown':
                    if (allezInputRef.current !== null) {
                        allezInputRef.current.blur();
                    }
                    break;
                case 'k':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        setOpen(true);
                    }
                    break;
                default:
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const onQuickFillItemClick = useCallback(
        (item: T) => {
            if (allezInputRef.current !== null) {
                const newSearchText = typeof item === 'string' ? item : item.label;
                setSearchText(newSearchText);
                allezInputRef.current.value = newSearchText;
            } else {
                throw Error('Could not find Allez search input element to update value');
            }
        },
        [setSearchText]
    );

    const onItemSelectCallback = useCallback((item: T) => {
        console.log('onItemSelectCallback', item);
        setOpen(false);
        if (showRecents) {
            const newRecents = addAllezRecent(item);
            setRecentSearches(newRecents);
        }
        onItemSelect(item);
    }, []);

    return (
        <>
            <SearchButton
                buttonProps={{
                    onClick: () => {
                        setOpen(true);
                    },
                }}
                mobile={isSmallScreen}
            />
            <Dialog
                id={ALLEZ_POPOVER_ID}
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
                sx={{ '& .MuiDialog-container': { backdropFilter: 'blur(4px)' } }}
                PaperProps={{
                    sx: {
                        width: '100%',
                        maxWidth: isSmallScreen ? 'unset' : maxWidth ?? theme.breakpoints.values.md,
                        height: '100%',
                        maxHeight: isSmallScreen ? 'unset' : maxHeight ?? theme.breakpoints.values.sm,
                    },
                }}
                fullScreen={isSmallScreen}
            >
                <Stack direction="column" height="100%">
                    <Stack direction="row">
                        <PaddedIcon icon={<SearchIcon />} />
                        <SearchInput
                            id={ALLEZ_SEARCH_INPUT_ID}
                            ref={allezInputRef}
                            placeholder={placeholder !== undefined ? placeholder : 'Allez!'}
                            inputProps={{ 'aria-label': 'search' }}
                            onClick={() => {
                                setOpen(true);
                            }}
                            onChange={debounce((e) => {
                                setSearchText(e.target.value);
                            }, 400)}
                            fullWidth
                            autoFocus
                        />
                        <Divider orientation="vertical" />
                        <IconButton onClick={() => setOpen(false)} sx={{ borderRadius: 'unset' }}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                    <Divider />
                    <Grid container sx={{ height: '100%' }}>
                        {quickFillItems && (
                            <Grid item xs={3}>
                                <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                                    <QuickFill
                                        quickFillItems={quickFillItems}
                                        onQuickItemClick={onQuickFillItemClick}
                                    />
                                    <Divider orientation="vertical" />
                                </div>
                            </Grid>
                        )}
                        <Grid item xs={quickFillItems ? 9 : 12}>
                            {searchResults.length > 0 && searchText.length > 0 ? (
                                <FilteredSearch
                                    searchResults={searchResults}
                                    onItemSelect={onItemSelectCallback}
                                    renderResult={renderResult}
                                />
                            ) : (
                                <RecentSearches
                                    recents={recentSearches}
                                    onItemSelect={onItemSelectCallback}
                                    renderRecent={renderRecent}
                                    toolbarElements={
                                        <Button
                                            onClick={() => {
                                                clearAllezRecents();
                                                setRecentSearches([]);
                                            }}
                                        >
                                            Clear Recents
                                        </Button>
                                    }
                                />
                            )}
                        </Grid>
                    </Grid>
                </Stack>
            </Dialog>
        </>
    );
};
