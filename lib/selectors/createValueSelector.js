import {createSelector} from 'reselect'

export default function createValueSelector (getState, options) {
  const VALUE = options.value || 'value'
  const ERROR = options.error || 'error'
  const PROMISE = options.promise || 'promise'
  const FETCHED = options.fetched || 'fetched'

  return {
    value: createSelector(getState, (state) => state[VALUE]),
    error: createSelector(getState, (state) => state[ERROR]),
    promise: createSelector(getState, (state) => state[PROMISE]),
    fetched: createSelector(getState, (state) => state[FETCHED]),
  }
}
