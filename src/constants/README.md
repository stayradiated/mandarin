# Constants

Easily generate constants for use with `mandarin/async`.

## Usage

```javascript
import newType from 'mandarin/constants'

import fetchAllALbums from './api'

export const FETCH_ALL_ALBUMS = newType('FETCH_ALL_ALBUMS')

// export const FETCH_ALL_ALBUMS_REQUEST = 'FETCH_ALL_ALBUMS_REQUEST'
// export const FETCH_ALL_ALBUMS_FAILURE = 'FETCH_ALL_ALBUMS_FAILURE'
// export const FETCH_ALL_ALBUMS_SUCCESS = 'FETCH_ALL_ALBUMS_SUCCESS'

export const fetchAllALbums = () => ({
  types: FETCH_ALL_ALBUMS,
  meta: {
    async: fetchAllALbums()
  },
}
```
