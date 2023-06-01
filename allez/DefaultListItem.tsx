import { ListItemButton, Typography } from '@mui/material';
import { AllezSearchItemRequirements } from './AllezSearch';

type DefaultListItemProps<T> = {
    item: T;
    onClick: () => void;
};

export const DefaultListItem = <T extends AllezSearchItemRequirements>(
    props: DefaultListItemProps<T>
) => {
    const { item, onClick } = props;
    return (
        <ListItemButton onClick={onClick}>
            <Typography>{typeof item !== 'string' ? item.label : item}</Typography>
        </ListItemButton>
    );
};
