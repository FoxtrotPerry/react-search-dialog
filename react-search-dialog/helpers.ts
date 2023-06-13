import { SearchItemRequirements } from './Search';

const LOCAL_STORAGE_RECENTS_KEY = 'rsdRecents';

/* Item Type Helpers */

/**
 * Returns the label of an item, whether it's a string or an object with a label property.
 */
export const getItemLabel = <T extends SearchItemRequirements>(item: T) => {
    return typeof item === 'string' ? item : item.label;
};

/* Equality Helpers */

/**
 * Returns true if the labels of two items are equal.
 */
export const listItemLabelsAreEqual = <T extends SearchItemRequirements>(a: T, b: T) => {
    return getItemLabel(a) === getItemLabel(b);
};

/* Local Storage Helpers */

/**
 * Returns the list of recents from local storage.
 * @returns The list of recents from local storage, or an empty array if there are no recents.
 */
export const getRecents = <T extends SearchItemRequirements>(): T[] => {
    const recentsString = localStorage.getItem(LOCAL_STORAGE_RECENTS_KEY);
    const parsedRecents: T[] = recentsString ? JSON.parse(recentsString) : [];
    return parsedRecents;
};

/**
 * Adds a selected item to local storage.
 * @param recent The search item to add.
 * @returns The updated list of recents search items.
 */
export const addRecent = <T extends SearchItemRequirements>(recent: T) => {
    const recents = getRecents<T>();
    const newRecentAlreadyExists = recents.some((r) => {
        return listItemLabelsAreEqual(r, recent);
    });
    // if the new recent already exists...
    if (newRecentAlreadyExists) {
        // put the new recent at the top of the list
        const newRecents = recents.filter((r) => {
            return !listItemLabelsAreEqual(r, recent);
        });
        setRecents([recent, ...newRecents]);
    } else {
        // otherwise, just add the new recent to the top of the list
        const newRecents = [recent, ...recents].slice(0, 10);
        setRecents(newRecents);
    }
    return getRecents<T>();
};

/**
 * Sets the list of recent selections in local storage.
 */
export const setRecents = <T extends SearchItemRequirements>(recents: T[]) => {
    localStorage.setItem(LOCAL_STORAGE_RECENTS_KEY, JSON.stringify(recents));
};

/**
 * Clears the list of recent selections from local storage.
 */
export const clearRecents = () => {
    localStorage.removeItem(LOCAL_STORAGE_RECENTS_KEY);
};
