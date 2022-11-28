import { useCallback, useEffect, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import { debounce, Divider, Grid, Popover, Stack } from '@mui/material';
import { QuickFill } from './QuickFill';
import { FilteredSearch } from './FilteredSearch';
import { SearchInput } from './SearchInput';
import { SearchContainer } from './SearchContainer';
import { StaticSearchIcon } from './StaticSearchIcon';

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

type AllezSearchProps<T> = {
    items: T[];
    quickFillItems?: T[];
    onItemSelect: (item: T) => void;
    renderResult?: (result: T) => JSX.Element;
};

export const AllezSearch = <T extends AllezSearchItemRequirements>({
    items,
    quickFillItems,
    onItemSelect,
    renderResult,
}: AllezSearchProps<T>) => {
    const [open, setOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState<T[]>([]);
    const [searchEngine, setSearchEngine] = useState<Fuse<T>>();

    const allezInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (
            allezInputRef.current === document.activeElement ||
            allezInputRef.current?.contains(document.activeElement)
        ) {
            setOpen(true);
        }
    }, [allezInputRef]);

    useEffect(() => {
        setSearchEngine(
            new Fuse(items, typeof items?.at(0) !== 'string' ? { keys: ['label'] } : undefined)
        );
    }, [items]);

    useEffect(() => {
        if (searchText.length === 0) {
            setSearchResults(items);
        } else {
            setSearchResults(searchEngine?.search(searchText).map((res) => res.item) ?? items);
        }
    }, [searchText, items]);

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

    return (
        <SearchContainer>
            <Stack direction="row">
                <StaticSearchIcon />
                <SearchInput
                    id={ALLEZ_SEARCH_INPUT_ID}
                    inputRef={allezInputRef}
                    placeholder="Allez!"
                    inputProps={{ 'aria-label': 'search' }}
                    onFocus={() => {
                        setOpen(true);
                    }}
                    onChange={debounce((e) => {
                        setSearchText(e.target.value);
                    }, 400)}
                />
            </Stack>
            <Popover
                id={ALLEZ_POPOVER_ID}
                open={open}
                anchorEl={allezInputRef.current}
                onClose={() => {
                    setOpen(false);
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                PaperProps={{
                    sx: { width: '70em', height: '40em' },
                }}
                disableAutoFocus
                disablePortal
            >
                <Grid container sx={{ height: '100%' }}>
                    {quickFillItems && (
                        <Grid item xs={3}>
                            <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                                <QuickFill
                                    quickFillItems={quickFillItems}
                                    onQuickItemClick={onQuickFillItemClick}
                                />
                                <div>
                                    <Divider orientation="vertical" />
                                </div>
                            </div>
                        </Grid>
                    )}
                    <Grid item xs={quickFillItems ? 9 : 12}>
                        <FilteredSearch
                            searchResults={searchResults}
                            onItemSelect={onItemSelect}
                            renderResult={renderResult}
                        />
                    </Grid>
                </Grid>
            </Popover>
        </SearchContainer>
    );
};
