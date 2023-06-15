# React Search Dialog🔎 ![Version](https://badgen.net/npm/v/react-search-dialog?icon=npm) ![NPM bundle size](https://img.shields.io/bundlephobia/minzip/react-search-dialog?color=brightgreen)

A batteries included search component that aims to make implementing a modern search experience in your application as easy as possible.

With a focus on performance and not reinventing the wheel, **React Search Dialog** is built on top of battle tested libraries [Fuse.js](https://fusejs.io/) and [react-window](https://github.com/bvaughn/react-window) so that no matter the item list, you'll get the results you're looking for near instantly!

## Features

- ✅ Handles massive data sets with ease
- ✅ Live results as you type
- ✅ Out of the box styling, with ability to customize as needed
- ✅ Mobile friendly
- ✅ Optional render functions for search results and recent items
- ✅ Built in recent search history (with ability to disable)
- ✅ Optional quick select section for common search items (fully customizable)

## Examples

🚧 _Coming soon!_

## Props

Below is a table of all props exposed by the `Search` component. The majority of this table is a pared down, more digestible version of the exported type `SearchProps` so
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
