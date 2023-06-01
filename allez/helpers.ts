import { AllezSearchItemRequirements } from './AllezSearch';

const LOCAL_STORAGE_RECENTS_KEY = 'allezRecents';

/* Item Type Helpers */

export const getItemLabel = <T extends AllezSearchItemRequirements>(item: T) => {
    return typeof item === 'string' ? item : item.label;
};

/* Equality Helpers */

export const listItemsAreEqual = <T extends AllezSearchItemRequirements>(a: T, b: T) => {
    return getItemLabel(a) === getItemLabel(b);
};

/* Local Storage Helpers */

export const getAllezRecents = <T extends AllezSearchItemRequirements>(): T[] => {
    const recentsString = localStorage.getItem(LOCAL_STORAGE_RECENTS_KEY);
    const parsedRecents: T[] = recentsString ? JSON.parse(recentsString) : [];
    return parsedRecents;
};

export const addAllezRecent = <T extends AllezSearchItemRequirements>(recent: T) => {
    const recents = getAllezRecents<T>();
    const newRecentAlreadyExists = recents.some((r) => {
        return getItemLabel(r) === getItemLabel(recent);
    });
    // if the new recent already exists...
    if (newRecentAlreadyExists) {
        // put the new recent at the top of the list
        const newRecents = recents.filter((r) => {
            return getItemLabel(r) !== getItemLabel(recent);
        });
        setAllezRecents([recent, ...newRecents]);
    } else {
        // otherwise, just add the new recent to the top of the list
        const newRecents = [recent, ...recents];
        setAllezRecents(newRecents);
    }
    return getAllezRecents<T>();
};

export const setAllezRecents = <T extends AllezSearchItemRequirements>(recents: T[]) => {
    localStorage.setItem(LOCAL_STORAGE_RECENTS_KEY, JSON.stringify(recents));
};

export const clearAllezRecents = () => {
    localStorage.removeItem(LOCAL_STORAGE_RECENTS_KEY);
};
