import { AllezSearchItemRequirements } from './AllezSearch';

const LOCAL_STORAGE_RECENTS_KEY = 'allezRecents';

/* Item Type Helpers */

/**
 * Returns the label of an item, whether it's a string or an object with a label property.
 */
export const getItemLabel = <T extends AllezSearchItemRequirements>(item: T) => {
    return typeof item === 'string' ? item : item.label;
};

/* Equality Helpers */

/**
 * Returns true if the labels of two items are equal.
 */
export const listItemLabelsAreEqual = <T extends AllezSearchItemRequirements>(a: T, b: T) => {
    return getItemLabel(a) === getItemLabel(b);
};

/* Local Storage Helpers */

/**
 * Returns the list of recents from local storage.
 * @returns The list of recents from local storage, or an empty array if there are no recents.
 */
export const getAllezRecents = <T extends AllezSearchItemRequirements>(): T[] => {
    const recentsString = localStorage.getItem(LOCAL_STORAGE_RECENTS_KEY);
    const parsedRecents: T[] = recentsString ? JSON.parse(recentsString) : [];
    return parsedRecents;
};

/**
 * Adds a selected item to local storage.
 * @param recent The search item to add.
 * @returns The updated list of recents search items.
 */
export const addAllezRecent = <T extends AllezSearchItemRequirements>(recent: T) => {
    const recents = getAllezRecents<T>();
    const newRecentAlreadyExists = recents.some((r) => {
        return listItemLabelsAreEqual(r, recent);
    });
    // if the new recent already exists...
    if (newRecentAlreadyExists) {
        // put the new recent at the top of the list
        const newRecents = recents.filter((r) => {
            return !listItemLabelsAreEqual(r, recent);
        });
        setAllezRecents([recent, ...newRecents]);
    } else {
        // otherwise, just add the new recent to the top of the list
        const newRecents = [recent, ...recents].slice(0, 10);
        setAllezRecents(newRecents);
    }
    return getAllezRecents<T>();
};

/**
 * Sets the list of recent selections in local storage.
 */
export const setAllezRecents = <T extends AllezSearchItemRequirements>(recents: T[]) => {
    localStorage.setItem(LOCAL_STORAGE_RECENTS_KEY, JSON.stringify(recents));
};

/**
 * Clears the list of recent selections from local storage.
 */
export const clearAllezRecents = () => {
    localStorage.removeItem(LOCAL_STORAGE_RECENTS_KEY);
};
