import { IconButton, Stack, Typography } from '@mui/material';
import { Button as BaseButton, ButtonProps as BaseButtonProps } from '@mui/base';
import SearchIcon from '@mui/icons-material/Search';
import { HotkeyChip } from './HotkeyChip';

const DEFAULT_BUTTON_THEME: React.CSSProperties = {};

type SearchButtonProps = {
    /**
     * Props to pass to the button component.
     * @see https://mui.com/material-ui/api/button/#props
     */
    buttonProps: BaseButtonProps;
    /**
     * If true, the button will be rendered as just an icon button to conserve space.
     * @default false
     */
    mobile?: boolean;
};

export const SearchButton = ({ buttonProps, mobile }: SearchButtonProps) => {
    return mobile ? (
        <IconButton>
            <SearchIcon />
        </IconButton>
    ) : (
        <BaseButton
            // variant="outlined"
            // focusRipple={false}
            style={DEFAULT_BUTTON_THEME}
            {...buttonProps}
            // sx={{ borderRadius: theme.shape.borderRadius, padding: 1, ...buttonProps.sx }}
        >
            <Stack spacing={1} direction="row">
                <SearchIcon />
                <Typography variant="button" sx={{ textTransform: 'none' }}>
                    Search...
                </Typography>
                <HotkeyChip chipText="Ctrl+K" />
            </Stack>
        </BaseButton>
    );
};
