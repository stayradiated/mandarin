# Redux Async Reducer

## Usage

### AsyncValueReducer

```javascript
import {AsyncValueReducer} from 'mandarin/reducer'

const fetchConfig = new AsyncValueReducer()

export default createReducer(
  fetchConfig.initialState, fetchConfig.handle(FETCH_CONFIG))
```

### AsyncMapReducer

```javascript
import {AsyncMapReducer} from 'mandarin/reducer'

const fetchItem = new AsyncMapReducer()

export default createReducer(
  fetchItem.initialState, fetchItem.handle(FETCH_ITEM))
```
