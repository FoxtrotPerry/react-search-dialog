import { ReactNode } from 'react';
import { useTheme } from '@mui/material';

export const PaddedIcon = ({
    icon,
    containerProps,
}: {
    icon: ReactNode;
    containerProps?: React.HTMLAttributes<HTMLDivElement>;
}) => {
    const theme = useTheme();
    return (
        <div
            style={{
                padding: theme.spacing(0, 1),
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...containerProps?.style,
            }}
            {...(() => {
                const propsWithNoStyle = { ...containerProps };
                delete propsWithNoStyle.style;
                return propsWithNoStyle;
            })()}
        >
            {icon}
        </div>
    );
};
