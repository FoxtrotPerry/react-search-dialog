import { Button, ButtonProps, IconButton, Stack, Typography, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { HotkeyChip } from './HotkeyChip';

export type SearchButtonProps = {
    /**
     * Props to pass to the button component.
     * @see https://mui.com/material-ui/api/button/#props
     */
    buttonProps: ButtonProps;
    /**
     * If true, the button will be rendered as just an icon button to conserve space.
     * @default false
     */
    mobile?: boolean;
};

/**
 * The default search button for react-search-dialog.
 * @param buttonProps Props to pass to the button component.
 * @param mobile If true, the button will be rendered as just an icon button to conserve space.
 *
 * @example
 * ```tsx
 * <SearchButton buttonProps={{ variant: 'contained', color: 'primary' }} />
 * ```
 */
export const SearchButton = ({ buttonProps, mobile }: SearchButtonProps) => {
    const theme = useTheme();
    return mobile ? (
        <IconButton variant="outlined" color="primary" {...buttonProps}>
            <SearchIcon />
        </IconButton>
    ) : (
        <Button
            variant="outlined"
            focusRipple={false}
            {...buttonProps}
            sx={{ borderRadius: theme.shape.borderRadius, padding: 1, ...buttonProps.sx }}
        >
            <Stack spacing={1} direction="row">
                <SearchIcon />
                <Typography variant="button" sx={{ textTransform: 'none' }}>
                    Search...
                </Typography>
                <HotkeyChip chipText="Ctrl+K" />
            </Stack>
        </Button>
    );
};
