#  Async

Dispatch async requests using promises.

First dispatches a `REQUEST` action, followed by a `SUCCESS` or `FAILURE`
action depending on how the promise is resolved.

## Usage
 
First include in your store middleware

```javascript
import {createStore, applyMiddleware} from 'redux'
import reduxPromise from 'redux-promise'
import reduxThunk from 'redux-thunk'
import reduxAsync from 'mandarin/async'

import rootReducer from './reducers'

createStore(rootReducer, applyMiddleware([
  reduxPromise,
  reduxThunk,
  reduxAsync,
]))
```

To use, set `types` to an array of three constants and set `meta.async` to a
promise.

```javascript
function fetchItemWithId (id) {
  return {
    types: ['REQUEST', 'FAILURE', 'SUCCESS'],
    payload: {id},
    meta: {
      async: fetch(`/items/${id}`)
    },
  }
```

### Dispatch

Dispatching a redux async action returns the `meta.async` promise, allowing you
to handle values or catch errors.

```javascript
store.dispatch(fetchItem(123))
  .then((result) => {
    console.log(result) // value from fetchItem
  })
  .catch((error) => {
    console.error(error) // error from fetchItem
  })
```

### Request Action

Where `<Promise>` is the `meta.async` promise.

```
{
  type: 'REQUEST',
  payload: {id: 1}
  promise: <Promise>,
}
```

### Failure Action

Where `<Error>` is the error that the `meta.async` promise is rejected with.

```
{
  type: 'FAILURE',
  payload: {id: 1},
  promise: <Promise>,
  error: <Error>,
}
```

### Success Action

Where `<Value>` is the value that the `meta.async` promise is resolved with.

```
{
  type: 'SUCCESS',
  payload: {id: 1},
  promise: <Promise>,
  value: <Value>,
}
```
