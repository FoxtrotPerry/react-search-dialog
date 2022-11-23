import React from 'react';
import { useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const StaticSearchIcon = () => {
    const theme = useTheme();
    return (
        <div
            style={{
                padding: theme.spacing(0, 1),
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <SearchIcon />
        </div>
    );
};
