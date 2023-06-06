import { useMediaQuery } from './useMediaQuery';

export const usePrefersDarkTheme = () => {
    return useMediaQuery('(prefers-color-scheme: dark)');
};
