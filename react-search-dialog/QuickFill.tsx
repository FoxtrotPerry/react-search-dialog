import { List, ListSubheader } from '@mui/material';
import { QuickFillListItem } from './QuickFillListItem';
import { SearchItemRequirements } from './Search';

type QuickFillProps<T> = {
    quickFillItems: T[];
    quickFillTitle?: string;
    onQuickItemClick: (elem: T) => void;
};

export const QuickFill = <T extends SearchItemRequirements>(props: QuickFillProps<T>) => {
    return (
        <List
            component="nav"
            subheader={
                <ListSubheader component="div">{props.quickFillTitle ?? 'Quick Fill'}</ListSubheader>
            }
            sx={{ width: '100%' }}
        >
            {props.quickFillItems.map((item, i) => {
                return (
                    <QuickFillListItem
                        label={typeof item === 'string' ? item : item.label}
                        quickItem={item}
                        onClick={props.onQuickItemClick}
                        key={`rsd-list-item-${i}`}
                    />
                );
            })}
        </List>
    );
};
