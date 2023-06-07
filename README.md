# React Search Dialog🔎

A batteries included search component that aims to make implementing a modern search experience in your application as easy as possible. With a focus on performance and refraining from reinventing the wheel, **React Search Dialog** is built on top of [Fuse.js](https://fusejs.io/) and [react-window](https://github.com/bvaughn/react-window) so that no matter the data size, you'll get the results you're looking for near instantly!

## Examples

## Features

## Props

Below is a table of all props exposed by the `Search` component. The majority of this table is a pared down, more digestable version of the exported type `SearchProps` so
if more detail is needed, please feel free to refer to the type definitions directly!

| Required | Prop Name | Prop Type | Description |
| :-----------: | ------------- | ------------- | ------------- |
| ✅ | `items` | Array of `T` (generic) | The items to search through. **IMPORTANT: `T` must have a `label` property OR be a string.** |
| ❌ | `buttonProps` | `ButtonProps` | Props to pass to the button that opens the search dialog. [Click here to read more about the props available to the Button component](https://mui.com/api/button/) |
| ❌ | `placeholder` | `string` | The placeholder text to display in the search input |
| ❌ | `itemHeight` | `number` or [`ItemHeightPreset`](./react-search-dialog/Search.tsx) | Height of each item in the search results |
| ❌ | `quickFillItems` | Array of `T` (generic) | Items to display in the quick fill section |
| ❌ | `maxHeight` | `string` or `number` | Maximum height of the search dialog |
| ❌ | `maxWidth` | `string` or `number` | Maximum width of the search dialog |
| ❌ | `noHistory` | `boolean` | Whether or not to record or display recent search history |
| ❌ | `onItemSelect` | `(item: T) => void` | Callback to fire when an item is selected |
| ❌ | `renderResult` | `(result: T, onItemSelectCallback: () => void) => JSX.Element` | Callback to render a single search result **IMPORTANT: Because you're supplying the render function for each search result, it's up to you to fire the provided `onItemSelectCallback()` function at the moment a user has selected a specific search item. This is what allows for search history tracking (if enabled) in custom components and handles the firing of your `onItemSelect` function, if defined!** |
| ❌ | `renderRecent` | `(recent: T, onItemSelectCallback: () => void) => JSX.Element` | Callback to render a single recent search item **IMPORTANT: Because you're supplying the render function for each recent search item, it's up to you to fire the provided `onItemSelectCallback()` function at the moment a user has selected a specific recent item. This is what allows for search history tracking (if enabled) in custom components and also handles the firing of your `onItemSelect` function, if defined!** |
