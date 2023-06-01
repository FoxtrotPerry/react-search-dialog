import { ListSubheader, Stack, Typography } from '@mui/material';
import { AllezSearchItemRequirements, AllezSearchProps } from './AllezSearch';
import { DefaultListItem } from './DefaultListItem';

import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

type RecentSearchProps<T> = {
    recents: T[];
    onItemSelect: AllezSearchProps<T>['onItemSelect'];
    renderRecent?: AllezSearchProps<T>['renderResult'];
    toolbarElements?: React.ReactNode;
};

export const RecentSearches = <T extends AllezSearchItemRequirements>(props: RecentSearchProps<T>) => {
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
                <Stack width="100%" alignItems="center" mt={12} style={{ color: 'lightgray' }}>
                    <AllInclusiveIcon />
                    <Typography variant="body2">No recent searches</Typography>
                </Stack>
            )}
        </div>
    );
};
