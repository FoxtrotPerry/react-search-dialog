import { useCallback, useState } from 'react';
import { VariableSizeList } from 'react-window';
import { ListItemButton, ListSubheader, Typography } from '@mui/material';
import { AllezSearchItemRequirements } from './AllezSearch';

type FilteredSearch<T> = {
    searchResults: T[];
    onItemSelect: (item: T) => void;
    renderResult?: (result: T) => JSX.Element;
};

type RenderWindowListItemParams = {
    index: number;
    style: React.CSSProperties;
};

type ContainerLengthWidth = {
    h: number;
    w: number;
};

export const FilteredSearch = <T extends AllezSearchItemRequirements>(props: FilteredSearch<T>) => {
    // opinion time: using a custom piece of state for container l and w is cleaner than
    // a piece of state containing the result of getBoundingClientRect()
    const [containerDimensions, setContainerDimensions] = useState<ContainerLengthWidth>({
        h: 0,
        w: 0,
    });
    const [headerHeight, setHeaderHeight] = useState(0);

    // TODO: Figure out how to capture a change of container dimensions in dependency array
    // good luck with that one...
    const getContainerDimensions = useCallback((div: HTMLDivElement | null) => {
        if (div) setContainerDimensions({ h: div.offsetHeight, w: div.offsetWidth });
    }, []);

    const getHeaderHeight = useCallback((div: HTMLDivElement | null) => {
        if (div) setHeaderHeight(div.offsetHeight);
    }, []);

    const renderWindowListItem = ({ index, style }: RenderWindowListItemParams) => {
        const result = props.searchResults[index];
        return (
            <div
                key={typeof result === 'string' ? `${result}-${index}` : `${result.label}`}
                style={style}
            >
                {props.renderResult
                    ? props.renderResult(result)
                    : renderDefaultListItem(result, () => {
                          props.onItemSelect(result);
                      })}
            </div>
        );
    };

    const renderDefaultListItem = useCallback((result: T, onClick: () => void) => {
        return (
            <ListItemButton onClick={onClick}>
                <Typography>{typeof result !== 'string' ? result.label : result}</Typography>
            </ListItemButton>
        );
    }, []);

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
            }}
            id="allez-search-results-container"
            ref={getContainerDimensions}
        >
            <ListSubheader component="div" id="allez-search-results-header" ref={getHeaderHeight}>
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
