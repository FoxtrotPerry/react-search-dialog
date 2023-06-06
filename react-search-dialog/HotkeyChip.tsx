import { Chip, Typography } from '@mui/material';
import { usePrefersDarkTheme } from './hooks/usePrefersDarkTheme';

const LIGHT_COLOR = 'rgba(220,220,220,0.9)';
const DARK_COLOR = 'rgba(15,15,15,0.7)';

export const HotkeyChip = ({ chipText }: { chipText: string }) => {
    const prefersDarkTheme = usePrefersDarkTheme();
    return (
        <Chip
            label={
                <Typography
                    color={prefersDarkTheme ? LIGHT_COLOR : DARK_COLOR}
                    variant="caption"
                    sx={{ textTransform: 'none' }}
                >
                    {chipText}
                </Typography>
            }
            size="small"
            sx={{
                cursor: 'pointer',
                backgroundColor: prefersDarkTheme ? DARK_COLOR : LIGHT_COLOR,
            }}
        />
    );
};
