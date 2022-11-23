import React, { ReactNode } from 'react';
import { alpha, useTheme } from '@mui/material';
import { Box } from '@mui/system';

type SearchContainerProps = {
    children: ReactNode;
};

export const SearchContainer = ({ children }: SearchContainerProps) => {
    const theme = useTheme();
    return (
        <Box
            component="div"
            sx={{
                position: 'relative',
                borderRadius: theme.shape.borderRadius,
                backgroundColor: alpha(theme.palette.common.white, 0.15),
                '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.25),
                },
                marginLeft: 0,
                width: '100%',
                [theme.breakpoints.up('sm')]: {
                    width: 'auto',
                },
            }}
        >
            {children}
        </Box>
    );
};
