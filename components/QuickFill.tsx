import { List, ListSubheader } from '@mui/material';
import { QuickFillListItem } from './QuickFillListItem';
import { AllezSearchItemRequirements } from './AllezSearch';

type QuickFillProps<T> = {
    quickFillItems: T[];
    onQuickItemClick: (elem: T) => void;
};

export const QuickFill = <T extends AllezSearchItemRequirements>(props: QuickFillProps<T>) => {
    return (
        <List
            component="nav"
            subheader={<ListSubheader component="div">Quick Fill</ListSubheader>}
            sx={{ width: '100%' }}
        >
            {props.quickFillItems.map((item, i) => {
                return (
                    <QuickFillListItem
                        label={typeof item === 'string' ? item : item.label}
                        quickItem={item}
                        onClick={props.onQuickItemClick}
                        key={`allez-list-item-${i}`}
                    />
                );
            })}
        </List>
    );
};
