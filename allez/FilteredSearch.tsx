import { useLayoutEffect, useState } from 'react';
import { VariableSizeList } from 'react-window';
import { ListSubheader } from '@mui/material';
import { AllezSearchItemRequirements, AllezSearchProps } from './AllezSearch';
import { DefaultListItem } from './DefaultListItem';

type FilteredSearch<T> = {
    searchResults: T[];
    onItemSelect: AllezSearchProps<T>['onItemSelect'];
    renderResult?: AllezSearchProps<T>['renderResult'];
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

export const FilteredSearch = <T extends AllezSearchItemRequirements>(props: FilteredSearch<T>) => {
    const [containerDimensions, setContainerDimensions] = useState<ContainerLengthWidth>({
        h: 0,
        w: 0,
    });
    const [headerHeight, setHeaderHeight] = useState(0);

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

    const renderWindowListItem = ({ index, style }: RenderWindowListItemParams) => {
        const result = props.searchResults[index];
        return (
            <div
                key={typeof result === 'string' ? `${result}-${index}` : `${result.label}`}
                style={style}
            >
                {props.renderResult ? (
                    props.renderResult(result, () => {
                        props.onItemSelect(result);
                    })
                ) : (
                    <DefaultListItem
                        item={result}
                        onClick={() => {
                            props.onItemSelect(result);
                        }}
                    />
                )}
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
                itemSize={() => 40}
            >
                {renderWindowListItem}
            </VariableSizeList>
        </div>
    );
};
