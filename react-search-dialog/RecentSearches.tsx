import { ListSubheader, Stack, Typography } from '@mui/material';
import { ItemHeight, SearchItemRequirements, SearchProps } from './Search';
import { DefaultListItem } from './DefaultListItem';

import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

type RecentSearchProps<T> = {
    /**
     * List of recently selected items.
     */
    recents: T[];
    /**
     * Height of each item in the list.
     */
    itemHeight: ItemHeight;
    /**
     * Callback for when an item is selected.
     */
    onItemSelect: SearchProps<T>['onItemSelect'];
    /**
     * Optional render function for recent selections.
     */
    renderRecent?: SearchProps<T>['renderResult'];
    /**
     * Optional toolbar elements to display above the list of recents.
     */
    toolbarElements?: React.ReactNode;
};

/**
 * Returns list of recent searches with a header and optional toolbar elements.
 */
export const RecentSearches = <T extends SearchItemRequirements>(props: RecentSearchProps<T>) => {
    const { recents, toolbarElements, onItemSelect, renderRecent } = props;
    return (
        <div
            style={{
                height: '100%',
                width: '100%',
                overflowY: 'auto',
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mr={1}>
                <ListSubheader component="div">Recents</ListSubheader>
                {toolbarElements}
            </Stack>
            {recents.length > 0 ? (
                recents.map((item) => (
                    <div key={typeof item === 'string' ? `${item}` : `${item.label}`}>
                        {renderRecent ? (
                            renderRecent(item, () => props.onItemSelect(item))
                        ) : (
                            <DefaultListItem
                                item={item}
                                onClick={() => {
                                    onItemSelect(item);
                                }}
                            />
                        )}
                    </div>
                ))
            ) : (
                <Stack
                    width="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                    style={{ color: 'lightgray', height: '33%' }}
                >
                    <AllInclusiveIcon />
                    <Typography variant="body2">No recent searches</Typography>
                </Stack>
            )}
        </div>
    );
};
