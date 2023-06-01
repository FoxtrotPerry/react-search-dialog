import { forwardRef, useEffect, useMemo } from 'react';
import { InputBase, InputBaseProps, SxProps, useTheme } from '@mui/material';

export const SearchInput = forwardRef(function SearchInput({ ...props }: InputBaseProps, ref) {
    const theme = useTheme();

    useEffect(() => {
        if (props.id) document.getElementById(props.id)?.focus();
    }, []);

    const inputSx: SxProps = useMemo(() => {
        return {
            color: 'inherit',
            '& .MuiInputBase-input': {
                padding: theme.spacing(1, 1, 1, 0),
                width: '100%',
            },
        };
    }, [theme]);

    return (
        <InputBase {...props} sx={props.sx ? { ...inputSx, ...props.sx } : inputSx} inputRef={ref} />
    );
});
