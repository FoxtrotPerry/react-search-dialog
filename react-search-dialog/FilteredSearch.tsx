import { useLayoutEffect, useState } from 'react';
import { VariableSizeList } from 'react-window';
import { ListSubheader } from '@mui/material';
import { ItemHeight, SearchItemRequirements, SearchProps } from './Search';
import { DefaultListItem } from './DefaultListItem';
import { getItemLabel } from './helpers';

type FilteredSearch<T> = {
    searchResults: T[];
    itemHeight: ItemHeight;
    onItemSelect: SearchProps<T>['onItemSelect'];
    renderResult?: SearchProps<T>['renderResult'];
};

type RenderWindowListItemParams = {
    index: number;
    style: React.CSSProperties;
};

type ContainerLengthWidth = {
    h: number;
    w: number;
};

const ALLEZ_SEARCH_RESULTS_HEADER_ID = 'allez-search-results-header';
const ALLEZ_SEARCH_RESULTS_CONTAINER_ID = 'allez-search-results-container';

/**
 * Returns a list of search results with a basic header.
 */
export const FilteredSearch = <T extends SearchItemRequirements>(props: FilteredSearch<T>) => {
    const [containerDimensions, setContainerDimensions] = useState<ContainerLengthWidth>({
        h: 0,
        w: 0,
    });
    const [headerHeight, setHeaderHeight] = useState(0);

    /**
     * Sets up and tears down the window resize listener to update the container dimensions.
     *
     * This is necessary because the virtualized list needs explicit height and width values
     * that we calculate using these dimensions.
     */
    useLayoutEffect(() => {
        const updateSize = () => {
            const containerDimensions = document
                .getElementById(ALLEZ_SEARCH_RESULTS_CONTAINER_ID)
                ?.getBoundingClientRect();

            const headerDimensions = document
                .getElementById(ALLEZ_SEARCH_RESULTS_HEADER_ID)
                ?.getBoundingClientRect();

            containerDimensions &&
                setContainerDimensions(
                    {
                        h: containerDimensions.bottom - containerDimensions.top,
                        w: containerDimensions.right - containerDimensions.left,
                    } ?? { h: 0, w: 0 }
                );

            headerDimensions && setHeaderHeight(headerDimensions.bottom - headerDimensions.top);
        };
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    /**
     * Renders a list item in the virtualized list.
     * @param index The index of the item to render.
     * @param style The style to apply to the item's root element.
     */
    const renderWindowListItem = ({ index, style }: RenderWindowListItemParams) => {
        const result = props.searchResults[index];
        return (
            <div key={`li-${getItemLabel(result)}`} style={style}>
                {
                    // If the user has provided a custom render function, use it.
                    props.renderResult ? (
                        props.renderResult(result, () => {
                            props.onItemSelect(result);
                        })
                    ) : (
                        // Otherwise, use the default list item.
                        <DefaultListItem
                            item={result}
                            onClick={() => {
                                props.onItemSelect(result);
                            }}
                        />
                    )
                }
            </div>
        );
    };

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
            }}
            id={ALLEZ_SEARCH_RESULTS_CONTAINER_ID}
        >
            <ListSubheader component="div" id={ALLEZ_SEARCH_RESULTS_HEADER_ID}>
                Search Results
            </ListSubheader>
            <VariableSizeList
                height={containerDimensions.h - headerHeight}
                width={containerDimensions.w}
                itemCount={props.searchResults.length}
                itemSize={() => props.itemHeight}
            >
                {renderWindowListItem}
            </VariableSizeList>
        </div>
    );
};
