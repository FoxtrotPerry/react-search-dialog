import { ListItemButton, Stack, Typography } from '@mui/material';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { AllezSearchItemRequirements } from './AllezSearch';

type QuickFillListItemProps<T> = {
    label: string;
    quickItem: T;
    onClick: (elem: T) => void;
};

export const QuickFillListItem = <T extends AllezSearchItemRequirements>(
    props: QuickFillListItemProps<T>
) => {
    return (
        <ListItemButton dense onClick={() => props.onClick(props.quickItem)}>
            <Stack direction="row" spacing={1}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <DriveFileRenameOutlineIcon />
                </div>
                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                    {props.label}
                </Typography>
            </Stack>
        </ListItemButton>
    );
};
