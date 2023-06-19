# React Search Dialog🔎 ![Version](https://badgen.net/npm/v/react-search-dialog?icon=npm) ![NPM bundle size](https://img.shields.io/bundlephobia/minzip/react-search-dialog?color=brightgreen)

A batteries included search component that aims to make implementing a modern search experience in your application as easy as possible.

With a focus on performance and not reinventing the wheel, **React Search Dialog** is built on top of battle tested libraries [Fuse.js](https://fusejs.io/) and [react-window](https://github.com/bvaughn/react-window) so that no matter the item list, you'll get the results you're looking for near instantly!

## Table of Contents

- [Installation](#installation)
  - [npm](#npm)
  - [yarn](#yarn)
  - [pnpm](#pnpm)
- [Features](#features)
- [Examples](#examples)
  - [Basic Usage](#basic-usage)
  - [Customizing Search Results](#customizing-search-results)
- [Props](#props)

## Installation

### npm

```bash
npm install react-search-dialog
```

### yarn

```bash
yarn add react-search-dialog
```

### pnpm

```bash
pnpm add react-search-dialog
```

## Features

- ✅ Handles massive data sets with ease
- ✅ Live results as you type
- ✅ Out of the box styling, with ability to customize as needed
- ✅ Mobile friendly
- ✅ Optional render functions for search results and recent items
- ✅ Built in recent search history (with ability to disable)
- ✅ Optional quick select section for common search items (fully customizable)

## Examples

A couple of examples to get you started!

### Basic Usage

Getting started with react-search-dialog is super simple! The minimum you need to get up and running is:

```tsx
import { Search } from 'react-search-dialog';

type User = {
  id: string;
  name: string;
  // A label property is required if not using a string array as your item list!
  label: string;
};

const items: User[] = [
  { id: '1', label: 'Item 1', name: 'Justin' },
  { id: '2', label: 'Item 2', name: 'Nick' },
  { id: '3', label: 'Item 3', name: 'Dan' },
  { id: '4', label: 'Item 4', name: 'Adam' },
  { id: '5', label: 'Item 5', name: 'Caleb' },
];

const App = () => {
  return (
    <Search items={items} onItemSelect={(item) => console.log(item)} />
  );
};
```

### Customizing Search Results

In most cases, you'll want to customize the look and feel of your search results to conform to your existing theming. You can acomplish that by utilizing the `renderResult` prop. The same can be done for recent items by using the `renderRecent` prop as well!

Here's a quick example of how you might customize your search results:

```tsx
import { useCallback } from 'react';
import { Search, RenderItemArgs } from 'react-search-dialog';

type CoffeeItem = {
  id: string;
  imgUrl: string;
  label: string; // A label property is required if not using a string array as your item list!
};

const items: CoffeeItem[] = [
  { id: '1', label: 'Latte', imgUrl: 'example.com/latte.png' },
  { id: '2', label: 'Macchiato', imgUrl: 'example.com/macchiiato.png' },
  { id: '3', label: 'Cappuccino', imgUrl: 'example.com/cappuccino.png' },
  { id: '4', label: 'Cold Brew', imgUrl: 'example.com/coldbrew.png' },
  { id: '5', label: 'Affogato', imgUrl: 'example.com/affogato.png' },
];

const renderResult = useCallback(
  ({ item, smallDisplay, closeDialog, addToRecents }: RenderItemArgs<Client>) => (
    <div
      onClick={() => {
        // Adds the item to the recent search history
        // if `noHistory` is not set to true.
        addToRecents(item);
        // Clsoes the search dialog.
        closeDialog();
      }}
    >
      {/* If the display is small, we'll only show the label */}
      {smallDisplay ? item.label : (
        <>
          <img src={item.imgUrl} alt={item.label} />
          <div>{item.label}</div>
        </>
      )}
    </div>
  ),
  []
);

const App = () => {
  return (
    <Search
      items={items}
      onItemSelect={(item) => console.log(item)}
      renderResult={renderResult}
    />
  );
};
```

## Props

Below is a table of all props offered by the `Search` component. The majority of this table is a pared down, more digestible version of the exported type `SearchProps` so
if more detail is needed, please feel free to refer to the type definitions directly!

| Key | |
| :-----------: | ------------- |
| ✅ | Required |
| ⚠ | Conditionally Optional |
| ❌ | Optional |

| Required | Prop Name | Prop Type | Description |
| :-----------: | ------------- | ------------- | ------------- |
| ✅ | `items` | Array of `T` (generic) | The items to search through. **IMPORTANT: `T` must have a `label` property OR be a string.** |
| ⚠ | `onItemSelect` | `(item: T) => void` | Callback to fire when an item is selected. **IMPORTANT: When NOT passing in your own render function with `renderResult`, this prop is required so that an action can be taken on search result / recent click.** |
| ❌ | `buttonProps` | `ButtonProps OR (isSmallScreen: boolean) => ButtonProps` | Props to pass to the button that opens the search dialog. [Click here to read more about the props available to the Button component](https://mui.com/api/button/) |
| ❌ | `placeholder` | `string` | The placeholder text to display in the search input |
| ❌ | `quickFillTitle` | `string` | The title used for the quick fill section of the search dialog |
| ❌ | `itemHeight` | `number` or [`ItemHeightPreset`](./react-search-dialog/Search.tsx) | Height of each item in the search results |
| ❌ | `quickFillItems` | Array of `T` (generic) | Items to display in the quick fill section |
| ❌ | `maxHeight` | `string` or `number` | Maximum height of the search dialog |
| ❌ | `maxWidth` | `string` or `number` | Maximum width of the search dialog |
| ❌ | `noHistory` | `boolean` | Whether or not to record or display recent search history |
| ❌ | `renderResult` | `({ item, smallDisplay, closeDialog, addToRecents }) => JSX.Element` | Callback to render a single search result **IMPORTANT: Because you're supplying the render function for each search result, it's up to you to use the `addToRecents` function when a selection is made by the user, and the `closeDialog` function when you see it appropriate for the search dialog to close.** |
| ❌ | `renderRecent` | `({ item, smallDisplay, closeDialog, addToRecents }) => JSX.Element` | Callback to render a single recent search item **IMPORTANT: Because you're supplying the render function for each recent search item, it's up to you to use the `addToRecents` function when a selection is made by the user, and the `closeDialog` function when you see it appropriate for the search dialog to close.** |
