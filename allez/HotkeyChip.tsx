import { Chip, Typography } from '@mui/material';

export const HotkeyChip = ({ chipText }: { chipText: string }) => {
    return (
        <Chip
            label={
                <Typography
                    color="rgba(220,220,220,0.9)"
                    variant="caption"
                    sx={{ textTransform: 'none' }}
                >
                    {chipText}
                </Typography>
            }
            size="small"
            sx={{
                cursor: 'pointer',
                backgroundColor: 'rgba(15,15,15,0.7)',
            }}
        />
    );
};
