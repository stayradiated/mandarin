# Cache

Requires (`redux-thunk`)[https://github.com/gaearon/redux-thunk] middleware.

## CacheValue

Cache a single async value

```javascript
import {cacheValue} from 'mandarin/cache'

export function requestConfigFromServer () {
  return fetch('/config.json')
    .then((response) => response.json())
}

// works well with 'mandarin/async' middleware
function fetchConfig () {
  return {
    types: [
      'FETCH_CONFIG_REQUEST',
      'FETCH_CONFIG_FAILURE',
      'FETCH_CONFIG_SUCCESS',
    ],
    meta: {
      async: requestConfigFromServer(),
    },
  }
}

const selectors = {
  // actual value of the action
  value: (state) => state.config.value,

  // undefined or a promise that resolves with the value
  promise: (state) => state.config.promise,

  // boolean of whether the value is available or not
  fetched: (state) => state.config.fetched,
}

fetchConfig = cacheValue(
  fetchConfig,
  () => ({ // passed the same arguments as the action,
    selectors,
  }),
)
```

## CacheMap

Cache an item in a Map

```javascript
import {cacheMap} from 'mandarin/cache'

export function requestItem (id) {
  return fetch(`/items/${id}`)
    .then((response) => response.json())
}

function fetchItem (id) {
  return {
    types: [
      'FETCH_ITEM_REQUEST',
      'FETCH_ITEM_FAILURE',
      'FETCH_ITEM_SUCCESS',
    ],
    payload: {
      id,
    },
    meta: {
      async: requestItem(id),
    },
  }
}

const selectors = {
  // an Map of ids to values
  values: (state) => state.items.values,

  // an Map of ids to promises
  promises: (state) => state.items.promises,

  // OPTIONAL: an Map of ids to booleans
  fetched: (state) => state.items.fetched,
}

fetchItem = cacheMap(
  fetchItem,
  (id) => ({ // passed the same arguments as the action
    id, // used to lookup the item in the map
    selectors,
  }),
)
```
