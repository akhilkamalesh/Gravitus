# Directory Information

This directory will store the hooks for each screen

The directory will be consisted of subfolders that will correspond to the screen it the hooks are being used

## About Hooks

Hooks are functions in React that allow functional components to "hook into" React state and lifecycle features. 
They enable developers to write functional components with state, side effects, and other functionalities that were previously only available in class components.

### Key Components:
useState, useEffect, useContext, useMemo, useReducer, etc.

useCallback: useCallback prevents this by giving you the same function instance between renders (until its dependencies change).
- Without useCallback, the increment function is re-created on every render. That’s usually harmless for small cases, but it can cause wasted re-renders or effect loops when the function is used in dependencies or passed to children. useCallback prevents that by giving React the same function instance until dependencies change.ff


### workout

### home