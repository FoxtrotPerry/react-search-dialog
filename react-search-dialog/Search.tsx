import React, { useCallback, useEffect, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import {
    Button,
    ButtonProps,
    debounce,
    Dialog,
    Divider,
    Grid,
    IconButton,
    Stack,
    useMediaQuery,
    useTheme,
} from '@mui/material';

import { QuickFill } from './QuickFill';
import { FilteredSearch } from './FilteredSearch';
import { SearchInput } from './SearchInput';
import { SearchButton } from './SearchButton';
import { RecentSearches } from './RecentSearches';
import { addRecent, clearRecents, getRecents } from './helpers';

import { PaddedIcon } from './PaddedIcon';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const ALLEZ_SEARCH_INPUT_ID = 'allez-search-input';
const ALLEZ_POPOVER_ID = 'allez-popover';

// TODO: implement variable row heights using this enum to support react-window's itemSize() function
/**
 * List item height preset values
 */
export enum ItemHeightPreset {
    SMALL = 24,
    MEDIUM = 32,
    LARGE = 40,
    XLARGE = 48,
}

/**
 * Type that describes the height of each search / recent list item
 */
export type ItemHeight = ItemHeightPreset | number;

/**
 * Type that every item passed into the `items` prop must extend
 */
export type SearchItemRequirements = { label: string } | string;

export type SearchProps<T> = {
    /**
     * List of items to search through.
     *
     * **NOTE: Each item must have a `label` property or be a string!**
     *
     * This constraint is enforced for two main reasons:
     * 1. So that the search engine has a property it can depend on being present to
     * use when searching
     * 2. When using the default `renderResult` function, it can assume that is the
     * item isn't a string, that is can use the `label` property to display the item
     * @see SearchItemRequirements
     */
    items: T[];
    /**
     * Props passed to the search button that opens main search dialog
     * @see ButtonProps
     * @link https://mui.com/api/button/
     */
    buttonProps?: ButtonProps;
    /**
     * Place holder displayed in the search input when empty
     * @default 'Search'
     */
    placeholder?: string;
    /**
     * Height of each search result item
     * @default ItemHeightPreset.LARGE
     * @see ItemHeight
     */
    itemHeight?: ItemHeight;
    /**
     * List of items to display in the quick fill section of the search dialog
     */
    quickFillItems?: T[];
    /**
     * Maximum height of the search dialog
     */
    maxHeight?: React.CSSProperties['maxHeight'];
    /**
     * Maximum width of the search dialog
     */
    maxWidth?: React.CSSProperties['maxWidth'];
    /**
     * Whether or not to show recent searches
     */
    noHistory?: boolean;
    /**
     * Callback function that is called when a search result item is selected
     * @param item The item that was selected
     */
    onItemSelect: (item: T) => void;
    /**
     * Function that renders each search result item
     * @param result The item to render
     * @param onItemSelectCallback Callback function that should be called when the item is selected
     * @returns JSX.Element
     */
    renderResult?: (result: T, onItemSelectCallback: () => void) => JSX.Element;
    /**
     * Function that renders each recent search item
     * @param recent The item to render
     * @param onItemSelectCallback Callback function that should be called when the item is selected
     * @returns JSX.Element
     */
    renderRecent?: (recent: T, onItemSelectCallback: () => void) => JSX.Element;
};

/**
 * All in one search component!
 *
 * **Required props:**
 * - `items` - List of items to search through. Each item must have a `label` property or be a string
 * - `onItemSelect` - Callback function that is fired when a search result item is selected
 *
 * **Recommended optional props:**
 * - `renderResult` - Function that renders each search result item
 * - `renderRecent` - Function that renders each recent search item
 * - `quickFillItems` - List of items to display in the quick fill section of the search dialog
 * - `itemHeight` - Height of each search result / recent search item
 *
 * @see SearchProps
 * @returns JSX.Element
 */
export const Search = <T extends SearchItemRequirements>({
    items,
    buttonProps,
    placeholder,
    itemHeight = ItemHeightPreset.LARGE,
    quickFillItems,
    maxHeight,
    maxWidth,
    noHistory = false,
    onItemSelect,
    renderResult,
    renderRecent,
}: SearchProps<T>) => {
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
        setRecentSearches(getRecents<T>());
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

    /**
     * Updates the search results state when the search text changes.
     * When search text is empty, all items are displayed (useful when the noHistory prop is evoked)
     */
    useEffect(() => {
        if (searchText === '') {
            setSearchResults(items);
        } else {
            setSearchResults(searchEngine?.search(searchText).map((res) => res.item) ?? items);
        }
    }, [searchText, items]);

    /**
     * Setups up and tears down the keydown event listeners that:
     * - Opens the search dialog when the user presses ctrl + k
     * - Close the search dialog when the user presses escape
     * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
     */
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

    /**
     * Handles the click event on a quick fill item by updating the search text and
     * input value to the item's label if item is an object or value otherwise
     */
    const onQuickFillItemClick = useCallback(
        (item: T) => {
            if (allezInputRef.current !== null) {
                const newSearchText = typeof item === 'string' ? item : item.label;
                setSearchText(newSearchText);
                allezInputRef.current.value = newSearchText;
            } else {
                throw Error('Could not find react-search-dialog search input element to update value');
            }
        },
        [setSearchText]
    );

    /**
     * Handles the click event on a search result item by calling the onItemSelect callback
     * and adding the item to the recent searches list if the noHistory prop is not evoked
     */
    const onItemSelectCallback = useCallback((item: T) => {
        setOpen(false);
        if (!noHistory) {
            const newRecents = addRecent(item);
            setRecentSearches(newRecents);
        }
        onItemSelect(item);
    }, []);

    return (
        <>
            <SearchButton
                buttonProps={{
                    ...buttonProps,
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
                        height: '100%',
                        maxWidth: isSmallScreen ? 'unset' : maxWidth ?? theme.breakpoints.values.md,
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
                            placeholder={placeholder !== undefined ? placeholder : 'Search'}
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
                        {quickFillItems && !isSmallScreen && (
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
                        <Grid item xs={true}>
                            {(searchResults.length > 0 && searchText.length > 0) || noHistory ? (
                                <FilteredSearch
                                    searchResults={searchResults}
                                    itemHeight={itemHeight}
                                    onItemSelect={onItemSelectCallback}
                                    renderResult={renderResult}
                                />
                            ) : (
                                <RecentSearches
                                    recents={recentSearches}
                                    itemHeight={itemHeight}
                                    onItemSelect={onItemSelectCallback}
                                    renderRecent={renderRecent}
                                    toolbarElements={
                                        <Button
                                            onClick={() => {
                                                clearRecents();
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
