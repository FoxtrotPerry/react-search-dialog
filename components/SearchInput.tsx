import React, { useMemo } from 'react';
import { InputBase, InputBaseProps, SxProps, useTheme } from '@mui/material';

interface SearchInputProps extends InputBaseProps {
    expandOnFocus?: boolean;
}

const SHRUNK_WIDTH = '15ch';
const EXPANDED_WIDTH = '50ch';

export const SearchInput = ({ expandOnFocus = true, ...props }: SearchInputProps) => {
    const theme = useTheme();

    const inputSx: SxProps = useMemo(() => {
        return {
            color: 'inherit',
            '& .MuiInputBase-input': {
                padding: theme.spacing(1, 1, 1, 0),
                transition: theme.transitions.create('width'),
                width: '100%',
                [theme.breakpoints.up('sm')]: {
                    width: SHRUNK_WIDTH,
                    '&:focus': {
                        width: expandOnFocus ? EXPANDED_WIDTH : SHRUNK_WIDTH,
                    },
                },
            },
        };
    }, [theme]);

    return <InputBase {...props} sx={props.sx ? { ...inputSx, ...props.sx } : inputSx} />;
};
